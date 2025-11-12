#!/bin/bash

# Fix getUserByEmail
sed -i '' 's/const rows = await sql`/const rows = (await sql`/g' src/lib/db.ts
sed -i '' '151s/)$/)) as UserRow[];/' src/lib/db.ts

# Fix getUserById  
sed -i '' '165s/)$/)) as UserRow[];/' src/lib/db.ts

# Fix getQuotesByUserId
sed -i '' '219s/)$/)) as QuoteRow[];/' src/lib/db.ts

# Fix getQuoteById
sed -i '' '237s/)$/)) as QuoteRow[];/' src/lib/db.ts

# Fix getCatalogsByUserId
sed -i '' '272s/)$/)) as CatalogRow[];/' src/lib/db.ts

# Fix getCatalogById
sed -i '' '287s/)$/)) as CatalogRow[];/' src/lib/db.ts

# Fix getInvitations
sed -i '' '335s/)$/)) as InvitationRow[];/' src/lib/db.ts

# Fix getInvitationByToken
sed -i '' '351s/)$/)) as InvitationRow[];/' src/lib/db.ts

# Fix getTemplatesByUserId
sed -i '' '402s/)$/)) as TemplateRow[];/' src/lib/db.ts

# Fix getTemplateById
sed -i '' '420s/)$/)) as TemplateRow[];/' src/lib/db.ts

