#!/bin/sh

# Load env vars

source .env.local

# Generate Supabase types

supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > src/types/supabase.ts

