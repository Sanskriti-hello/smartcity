
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Supabase URL or service role key is missing.');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function seedDatabase() {
  try {
    // Seed Zones
    const { data: zones, error: zoneError } = await supabase.from('zone').insert([
      { zone_name: 'Palasia', type: 'Commercial' },
      { zone_name: 'Vijay Nagar', type: 'Commercial' },
      { zone_name: 'Rau', type: 'Industrial' },
      { zone_name: 'Sudama Nagar', type: 'Residential' },
    ]).select();
    if (zoneError) throw zoneError;
    console.log('Zones seeded:', zones);

    // Seed Citizens
    const { data: citizens, error: citizenError } = await supabase.from('citizen').insert([
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@smartcity.com',
        password_hash: 'adminpassword',
        role: 'admin',
        address_city: 'Indore',
      },
      {
        first_name: 'Normal',
        last_name: 'Citizen',
        email: 'citizen@smartcity.com',
        password_hash: 'citizenpassword',
        role: 'citizen',
        address_city: 'Indore',
      },
      {
        first_name: 'Service',
        last_name: 'Provider',
        email: 'provider@smartcity.com',
        password_hash: 'providerpassword',
        role: 'provider',
        address_city: 'Indore',
      },
    ]).select();
    if (citizenError) throw citizenError;
    console.log('Citizens seeded:', citizens);

    // Seed Service Providers
    const { data: providers, error: providerError } = await supabase.from('service_provider').insert([
        { name: 'Indore Municipal Corporation', service_type: 'Waste Management' },
        { name: 'MPWZ', service_type: 'Electricity' },
    ]).select();
    if (providerError) throw providerError;
    console.log('Service Providers seeded:', providers);


    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
