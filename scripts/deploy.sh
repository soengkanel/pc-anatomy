#!/usr/bin/env bash
# Deploy IDIC to the VPS as its own containers (never touches kustomai):
#   idic_postgres  — private Postgres (own volume + network, no published port)
#   idic_app       — Next.js app on host port 3100
# Reads IP / Username / Password from .env. Secrets for the app are generated
# once into ~/idic/.env.production on the server and reused on later deploys.
set -euo pipefail
cd "$(dirname "$0")/.."

# Read literally (the password may contain $ characters).
getv() { grep -E "^$1=" .env | head -1 | cut -d= -f2-; }
IP=$(getv IP); Username=$(getv Username)
export SSHPASS="$(getv Password)"
SSH="sshpass -e ssh -o ConnectTimeout=15 $Username@$IP"

$SSH 'mkdir -p ~/idic'
sshpass -e rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .git \
  --exclude '.env*' --exclude '*.tsbuildinfo' \
  -e ssh ./ "$Username@$IP:~/idic/"

$SSH 'bash -s' <<'REMOTE'
set -euo pipefail
cd ~/idic
ENVF=~/idic/.env.production

# ── first-time secrets ──────────────────────────────────────────
if [ ! -s "$ENVF" ]; then
  PGPW=$(openssl rand -hex 18)
  TPW=$(openssl rand -base64 12 | tr -d '=+/' | cut -c1-14)
  cat > "$ENVF" <<EOF
POSTGRES_PASSWORD=$PGPW
DATABASE_URL=postgres://idic:$PGPW@idic_postgres:5432/idic
SESSION_SECRET=$(openssl rand -hex 32)
TEACHER_PASSWORD=$TPW
COOKIE_SECURE=false
EOF
  chmod 600 "$ENVF"
  echo "NEW_TEACHER_PASSWORD=$TPW"
fi
PGPW=$(grep '^POSTGRES_PASSWORD=' "$ENVF" | cut -d= -f2-)

# ── private network + postgres ─────────────────────────────────
docker network inspect idic_net >/dev/null 2>&1 || docker network create idic_net >/dev/null
if ! docker ps -a --format '{{.Names}}' | grep -qx idic_postgres; then
  docker run -d --name idic_postgres --restart unless-stopped --network idic_net \
    --memory 384m -v idic_pgdata:/var/lib/postgresql/data \
    -e POSTGRES_USER=idic -e POSTGRES_DB=idic -e POSTGRES_PASSWORD="$PGPW" \
    postgres:17-alpine >/dev/null
fi
# pg_isready passes during first-boot init; wait for a real query to succeed.
for i in $(seq 1 60); do
  docker exec idic_postgres psql -U idic -d idic -tAc 'select 1' >/dev/null 2>&1 && break
  sleep 1
done

# ── migrations (idempotent) ────────────────────────────────────
for f in supabase/migrations/*.sql; do
  docker exec -i idic_postgres psql -U idic -d idic -v ON_ERROR_STOP=1 -q < "$f" >/dev/null
  echo "migrated: $f"
done

# ── app ────────────────────────────────────────────────────────
nice -n 15 docker build --memory 2g -t idic:local . | tail -2
docker rm -f idic_app >/dev/null 2>&1 || true
docker run -d --name idic_app --restart unless-stopped --network idic_net \
  --memory 768m --cpus 1 --env-file "$ENVF" -p 3100:3000 idic:local >/dev/null
sleep 6
curl -s -o /dev/null -w "health: http %{http_code}\n" localhost:3100/
docker image prune -f >/dev/null
REMOTE
echo "Deployed: http://$IP:3100"
