-- Fix infinite recursion in RLS policies.
--
-- The circular reference was:
--   rooms_select_member  → EXISTS (SELECT FROM user_rooms ...)
--   user_rooms_select    → OR EXISTS (SELECT FROM rooms ...)   ← causes the loop
--
-- Fix: user_rooms_select no longer references rooms.
-- A user can already see their own rows (user_id = auth.uid()).
-- The host-side visibility of user_rooms is not needed by any current policy.

DROP POLICY IF EXISTS "user_rooms_select" ON user_rooms;

CREATE POLICY "user_rooms_select"
    ON user_rooms FOR SELECT
    USING (user_id = auth.uid());
