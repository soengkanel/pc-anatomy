#!/usr/bin/env bash
# Create (or reset the PIN of) a teacher and give them every course that has no owner.
#   ./scripts/create-teacher.sh <username> "<Display Name>" <pin>
# The PIN is hashed on THIS machine (scrypt, same format as the app); only the
# hash is sent to the VPS.
set -euo pipefail
cd "$(dirname "$0")/.."
[ $# -eq 3 ] || { echo "usage: $0 <username> \"<Display Name>\" <pin>"; exit 1; }
USERNAME="$1"; DISPLAY="$2"; PIN="$3"
[[ "$USERNAME" =~ ^[a-z0-9_-]{2,30}$ ]] || { echo "username: 2-30 chars of a-z 0-9 _ -"; exit 1; }
[[ "$DISPLAY" != *"'"* ]] || { echo "display name must not contain a single quote"; exit 1; }

HASH=$(PIN="$PIN" node -e '
const c=require("node:crypto");const s=c.randomBytes(16);
console.log(s.toString("hex")+":"+c.scryptSync(process.env.PIN,s,32).toString("hex"))')

getv() { grep -E "^$1=" .env | head -1 | cut -d= -f2-; }
IP=$(getv IP); VU=$(getv Username); export SSHPASS="$(getv Password)"
sshpass -e ssh -o ConnectTimeout=15 "$VU@$IP" "docker exec -i idic_postgres psql -U idic -d idic -v ON_ERROR_STOP=1 -q" <<SQL
insert into teachers (username, display_name, pin_hash) values ('$USERNAME', '$DISPLAY', '$HASH')
  on conflict (lower(username)) do update set display_name = excluded.display_name, pin_hash = excluded.pin_hash;
update courses set teacher_id = (select id from teachers where lower(username) = lower('$USERNAME'))
  where teacher_id is null;
update live_sessions set teacher_id = (select id from teachers where lower(username) = lower('$USERNAME'))
  where teacher_id is null;
select t.username, t.display_name, (select count(*) from courses c where c.teacher_id = t.id) as courses
  from teachers t where lower(t.username) = lower('$USERNAME');
SQL
echo "Teacher ready: http://$IP:3100/  (sign in as '$USERNAME')"
