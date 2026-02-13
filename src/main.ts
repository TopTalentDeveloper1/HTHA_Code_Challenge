import { createApp } from './app';
import { config } from './config';
import { PropertyService } from './domain/services/property.service';
import { PropertyController } from './api/controllers/property.controller';
import { SupabasePropertyRepository } from './infrastructure/database/repositories/supabase-property.repository';
import { supabase } from './infrastructure/database/supabase/client';

async function bootstrap() {
  if (!config.supabase.url || !config.supabase.key) {
    console.error('❌ Supabase configuration is required. Please set SUPABASE_URL and SUPABASE_KEY environment variables.');
    process.exit(1);
  }

  try {
    await supabase.from('properties').select('id').limit(1);
    console.log('✓ Connected to Supabase');
  } catch (err: any) {
    console.error('❌ Failed to connect to Supabase:', err.message);
    console.error('Please verify your Supabase credentials and database connection.');
    process.exit(1);
  }

  const repository = new SupabasePropertyRepository();
  const propertyService = new PropertyService(repository);
  const propertyController = new PropertyController(propertyService);
  const app = createApp(propertyController);

  const port = config.port;
  app.listen(port, () => {
    console.log(`\n🚀 Server running on http://localhost:${port}`);
    console.log(`📦 Repository: Supabase\n`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Fatal error starting server:', err);
  process.exit(1);
});
