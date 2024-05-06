
# Own Git

This is an (incomplete) reproduction implementation of Git in TypeScript on Deno.

https://github.com/HosokawaR/own-git/assets/45098934/01e4951b-b073-4e34-8866-7638be3480e2

## Features

Only basic features are implemented.
Some operations are not implemented yet.

- `init`
- `add`
- `commit`
- `log`
- `checkout`

For development, you can `PLANE_MODE=true`.
This option make git store data in plain files instead of binary files to see the contents.

## Deno

Support only ASCII contents.

```console
git clone https://github.com/HosokawaR/own-git
cd own-git
mkdir _sand && cd _sand

export PLANE_MODE=true

# Initialize
deno run -A ../index.ts init

# some file
echo "Hello" > README.md

# Add
deno run -A ../index.ts add README.md

# Commit
deno run -A ../index.ts commit -m "1st"

# modify file
echo "World!!" > README.md

# Add
deno run -A ../index.ts add README.md

# Log
deno run -A ../index.ts log

# Checkout
deno run -A ../index.ts checkout <commit SHA>
```
