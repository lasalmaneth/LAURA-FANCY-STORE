-- Seed Categories
INSERT INTO public.categories (id, name, slug) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Seating', 'seating'),
  ('22222222-2222-2222-2222-222222222222', 'Tables', 'tables'),
  ('33333333-3333-3333-3333-333333333333', 'Shelving', 'shelving')
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
INSERT INTO public.products (id, name, slug, description, short_description, price, category_id, product_code, stock_status, featured, active) VALUES
  (
    'a1111111-1111-1111-1111-111111111111',
    'OAK SIDE CHAIR',
    'oak-side-chair',
    'Solid white oak. Hand-planed, hand-oiled. Each chair unique in grain and character. Built with traditional mortise and tenon joinery for heirloom quality.',
    'Solid white oak. Hand-planed, hand-oiled. Each chair unique in grain.',
    485.00,
    '11111111-1111-1111-1111-111111111111',
    'LFS-001',
    'in_stock',
    false,
    true
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'DINING TABLE',
    'dining-table',
    'Reclaimed pine with hand-cut dovetail joinery. Seats 6 comfortably. Finished with organic beeswax and linseed oil.',
    'Reclaimed pine with dovetail joinery. Seats 6 comfortably. Heirloom quality.',
    1240.00,
    '22222222-2222-2222-2222-222222222222',
    'LFS-002',
    'in_stock',
    true,
    true
  ),
  (
    'c3333333-3333-3333-3333-333333333333',
    'WALL SHELF UNIT',
    'wall-shelf-unit',
    'Three-tier solid ash wall mounted shelf. Minimal brackets, maximum character. Perfect for displaying ceramics and literature.',
    'Three-tier solid ash. Minimal brackets, maximum character.',
    320.00,
    '33333333-3333-3333-3333-333333333333',
    'LFS-003',
    'in_stock',
    false,
    true
  )
ON CONFLICT (slug) DO NOTHING;
