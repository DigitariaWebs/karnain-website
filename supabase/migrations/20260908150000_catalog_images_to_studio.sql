-- Point `fragrances.images` at the approved studio photographs.
--
-- These were introduced as a code-level override (`getStudioProductImage`) that swapped the real
-- photo in at render time while `images` still held the earlier renders. The public site therefore
-- showed one picture and the admin's edit form showed another, and no amount of editing in the
-- back office could reconcile them — the override always won. Moving the paths into the column
-- makes the database the single source of truth, so what an admin sees is what visitors see, and
-- uploading a replacement actually replaces it.
update public.fragrances set images = array['/images/fragrances/' || slug || '-studio-v3.png']
where slug in ('tobacco', 'cuir-90', 'rose-des-iles', 'tentation', 'sucre-addictee', 'cherry-je-taime');
