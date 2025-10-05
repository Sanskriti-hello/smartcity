-- This SQL schema is designed for PostgreSQL.
-- It translates the provided ER description into a relational database structure.

-- =============================================
-- Core Entities: Citizen, Zone, House, Vehicle
-- =============================================

CREATE TABLE Zone (
    zone_id SERIAL PRIMARY KEY,
    zone_name VARCHAR(255) NOT NULL,
    type VARCHAR(100) -- e.g., Residential, Commercial, Industrial
);

CREATE TABLE Citizen (
    citizen_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'citizen', -- citizen, admin, provider
    gender VARCHAR(20),
    dob DATE,
    -- Address components are broken down for better querying
    address_street VARCHAR(255),
    address_area VARCHAR(255),
    address_city VARCHAR(100),
    address_pincode VARCHAR(10)
);

-- A separate table for multivalued phone numbers
CREATE TABLE Citizen_Phone_Number (
    citizen_id INT REFERENCES Citizen(citizen_id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    PRIMARY KEY (citizen_id, phone_number)
);

CREATE TABLE House (
    house_id SERIAL PRIMARY KEY,
    type VARCHAR(100), -- e.g., Apartment, Independent
    area VARCHAR(255),
    zone_id INT REFERENCES Zone(zone_id)
);

-- Relationship: Citizen lives in House (Many-to-Many junction table)
CREATE TABLE Citizen_Residency (
    citizen_id INT REFERENCES Citizen(citizen_id),
    house_id INT REFERENCES House(house_id),
    PRIMARY KEY (citizen_id, house_id)
);

CREATE TABLE Vehicle (
    vehicle_no VARCHAR(50) PRIMARY KEY,
    type VARCHAR(100), -- e.g., Car, Bike, Bus
    model VARCHAR(100),
    owner_id INT REFERENCES Citizen(citizen_id) -- One-to-Many: One citizen can own multiple vehicles
);

-- =============================================
-- Service Providers
-- =============================================

CREATE TABLE Service_Provider (
    provider_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100),
    contact_no VARCHAR(20)
);

-- =============================================
-- Services (using Class Table Inheritance)
-- =============================================

-- Base Service Table
CREATE TABLE Service (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2),
    availability_status VARCHAR(50),
    operating_hours VARCHAR(100),
    provider_id INT REFERENCES Service_Provider(provider_id)
);

-- A separate table for multivalued contact emails
CREATE TABLE Service_Contact_Email (
    service_id INT REFERENCES Service(service_id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (service_id, email)
);

-- A separate table for multivalued contact phone numbers
CREATE TABLE Service_Contact_Phone (
    service_id INT REFERENCES Service(service_id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    PRIMARY KEY (service_id, phone_number)
);


-- Transport Sub-Type
CREATE TABLE Transport (
    transport_id SERIAL PRIMARY KEY,
    service_id INT UNIQUE REFERENCES Service(service_id) ON DELETE CASCADE,
    mode VARCHAR(100) -- e.g., Bus, Metro, Tram
);

CREATE TABLE Route (
    route_id SERIAL PRIMARY KEY,
    start_point VARCHAR(255),
    end_point VARCHAR(255),
    distance_km DECIMAL(8, 2)
);

CREATE TABLE Transport_Schedule (
    schedule_id SERIAL PRIMARY KEY,
    transport_id INT REFERENCES Transport(transport_id),
    route_id INT REFERENCES Route(route_id),
    days_of_operation VARCHAR(255), -- e.g., "Mon-Fri", "Weekends"
    frequency VARCHAR(100), -- e.g., "Every 15 mins"
    start_time TIME,
    end_time TIME,
    status VARCHAR(50)
);


-- Health Care Sub-Type
CREATE TABLE Health_Care (
    hospital_id SERIAL PRIMARY KEY,
    service_id INT UNIQUE REFERENCES Service(service_id) ON DELETE CASCADE,
    name VARCHAR(255),
    capacity INT,
    type VARCHAR(100) -- e.g., Public, Private
);

CREATE TABLE Doctor (
    doctor_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    specialization VARCHAR(255)
);

-- Relationship: Doctor works in Health_Care (Many-to-Many junction table)
CREATE TABLE Doctor_Affiliation (
    doctor_id INT REFERENCES Doctor(doctor_id),
    hospital_id INT REFERENCES Health_Care(hospital_id),
    PRIMARY KEY (doctor_id, hospital_id)
);


-- Utility Sub-Type (Base table for utilities)
CREATE TABLE Utility (
    utility_id SERIAL PRIMARY KEY,
    service_id INT UNIQUE REFERENCES Service(service_id) ON DELETE CASCADE,
    price_per_unit DECIMAL(10, 4),
    unit VARCHAR(50),
    billing_date DATE
);

-- Utility Specializations
CREATE TABLE Internet (
    internet_id SERIAL PRIMARY KEY,
    utility_id INT UNIQUE REFERENCES Utility(utility_id) ON DELETE CASCADE,
    bandwidth_mbps INT,
    coverage_area VARCHAR(255),
    service_type VARCHAR(100) -- e.g., Fiber, 5G
);

CREATE TABLE Water (
    water_id SERIAL PRIMARY KEY,
    utility_id INT UNIQUE REFERENCES Utility(utility_id) ON DELETE CASCADE,
    source VARCHAR(255),
    quality_level VARCHAR(100),
    supply_hours VARCHAR(100)
);

CREATE TABLE Fuel (
    fuel_id SERIAL PRIMARY KEY,
    utility_id INT UNIQUE REFERENCES Utility(utility_id) ON DELETE CASCADE,
    type VARCHAR(50) -- e.g., Petrol, Diesel, CNG
);

CREATE TABLE Electricity (
    electricity_id SERIAL PRIMARY KEY,
    utility_id INT UNIQUE REFERENCES Utility(utility_id) ON DELETE CASCADE,
    voltage_level VARCHAR(50),
    source_type VARCHAR(100) -- e.g., Solar, Grid
);

CREATE TABLE Waste_Management (
    waste_id SERIAL PRIMARY KEY,
    utility_id INT UNIQUE REFERENCES Utility(utility_id) ON DELETE CASCADE,
    collection_schedule VARCHAR(255),
    processing_method VARCHAR(255),
    type VARCHAR(100), -- e.g., Residential, Commercial
    zone_id INT REFERENCES Zone(zone_id)
);

-- =============================================
-- Infrastructure (using Class Table Inheritance)
-- =============================================

-- Base Infrastructure Table (abstract)
CREATE TABLE Infrastructure_Asset (
    asset_id SERIAL PRIMARY KEY,
    zone_id INT REFERENCES Zone(zone_id),
    location GEOMETRY(Point, 4326) -- Using PostGIS for location data
);

-- Infrastructure Sub-Types
CREATE TABLE Smart_Bin (
    bin_id SERIAL PRIMARY KEY,
    asset_id INT UNIQUE REFERENCES Infrastructure_Asset(asset_id) ON DELETE CASCADE,
    capacity_litres INT,
    fill_level_percent INT,
    sensor_status VARCHAR(50),
    collection_schedule VARCHAR(255)
);

CREATE TABLE Public_Light (
    light_id SERIAL PRIMARY KEY,
    asset_id INT UNIQUE REFERENCES Infrastructure_Asset(asset_id) ON DELETE CASCADE,
    status VARCHAR(50), -- On, Off, Faulty
    type VARCHAR(100), -- LED, Solar
    installation_date DATE,
    power_rating_watts INT
);

CREATE TABLE Power_Node (
    node_id SERIAL PRIMARY KEY,
    asset_id INT UNIQUE REFERENCES Infrastructure_Asset(asset_id) ON DELETE CASCADE,
    capacity_kw INT,
    installation_date DATE,
    status VARCHAR(50)
);

CREATE TABLE Pipeline (
    pipeline_id SERIAL PRIMARY KEY,
    asset_id INT UNIQUE REFERENCES Infrastructure_Asset(asset_id) ON DELETE CASCADE,
    length_km DECIMAL(8, 2),
    diameter_cm INT,
    flow_type VARCHAR(100), -- Water, Gas
    material_type VARCHAR(100) -- PVC, Steel
);

-- =============================================
-- Sensors and Readings (using Class Table Inheritance)
-- =============================================

-- Base Sensor Table
CREATE TABLE Sensor (
    sensor_id SERIAL PRIMARY KEY,
    asset_id INT UNIQUE REFERENCES Infrastructure_Asset(asset_id) ON DELETE CASCADE,
    status VARCHAR(50),
    provider_id INT REFERENCES Service_Provider(provider_id),
    data_frequency_seconds INT,
    last_calibrated DATE,
    installation_date DATE
);

-- Sensor Specializations
CREATE TABLE Traffic_Sensor (
    traffic_sensor_id SERIAL PRIMARY KEY,
    sensor_id INT UNIQUE REFERENCES Sensor(sensor_id) ON DELETE CASCADE
);

CREATE TABLE Air_Quality_Sensor (
    aq_sensor_id SERIAL PRIMARY KEY,
    sensor_id INT UNIQUE REFERENCES Sensor(sensor_id) ON DELETE CASCADE
);

CREATE TABLE Weather_Sensor (
    weather_sensor_id SERIAL PRIMARY KEY,
    sensor_id INT UNIQUE REFERENCES Sensor(sensor_id) ON DELETE CASCADE
);

-- Sensor Reading Tables
CREATE TABLE Traffic_Sensor_Reading (
    reading_id SERIAL PRIMARY KEY,
    traffic_sensor_id INT REFERENCES Traffic_Sensor(traffic_sensor_id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    avg_speed_kmh DECIMAL(5, 2),
    congestion_level DECIMAL(5, 2),
    vehicle_count INT
);

CREATE TABLE AQ_Reading (
    reading_id SERIAL PRIMARY KEY,
    aq_sensor_id INT REFERENCES Air_Quality_Sensor(aq_sensor_id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    pm2_5 DECIMAL(8, 2),
    pm10 DECIMAL(8, 2),
    co2_level_ppm INT,
    aq_index INT,
    no2_level_ppm DECIMAL(8, 2)
);

CREATE TABLE Weather_Reading (
    reading_id SERIAL PRIMARY KEY,
    weather_sensor_id INT REFERENCES Weather_Sensor(weather_sensor_id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    temperature_celsius DECIMAL(5, 2),
    humidity_percent DECIMAL(5, 2),
    pressure_hpa DECIMAL(8, 2),
    wind_speed_kmh DECIMAL(5, 2),
    rainfall_mm DECIMAL(8, 2)
);


-- =============================================
-- Grievance System
-- =============================================

CREATE TABLE Grievance (
    grievance_id SERIAL PRIMARY KEY,
    citizen_id INT REFERENCES Citizen(citizen_id),
    service_id INT REFERENCES Service(service_id),
    assigned_provider_id INT REFERENCES Service_Provider(provider_id) NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_text VARCHAR(255),
    location_coords GEOMETRY(Point, 4326) NULL,
    status VARCHAR(50) DEFAULT 'Submitted', -- Submitted, In Progress, Resolved, Closed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for storing photos related to a grievance
CREATE TABLE Grievance_Photo (
    photo_id SERIAL PRIMARY KEY,
    grievance_id INT REFERENCES Grievance(grievance_id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL
);

-- =============================================
-- Announcement System
-- =============================================

CREATE TABLE Announcement (
    announcement_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================================================================================
-- SQL SCRIPT TO POPULATE THE SMART CITY DATABASE WITH SAMPLE DATA
-- ===================================================================================
-- Note: This script assumes the tables have been created and are empty.
-- It's best to run this after creating the schema or dropping all tables.
-- The order of insertion is important to respect foreign key constraints.
-- ===================================================================================


-- =============================================
-- Step 1: Core Entities (No Dependencies)
-- =============================================

-- Populate Zones
INSERT INTO Zone (zone_name, type) VALUES
('Vijay Nagar', 'Commercial'),
('Rau', 'Industrial'),
('Old Palasia', 'Residential'),
('Annapurna', 'Mixed-Use');

-- Populate Citizens
-- IMPORTANT: The password_hash is a placeholder for 'password123'.
-- In a real application, your backend would generate this hash using bcrypt.
-- Hash generated from: https://www.browserling.com/bcrypt
INSERT INTO Citizen (first_name, last_name, email, password_hash, role, gender, dob, address_street, address_area, address_city, address_pincode) VALUES
('Priya', 'Sharma', 'priya.sharma@email.com', '$2a$10$wZ4.g.g5c5j6k7l8m9n0bO8h7g6f5e4d3c2b1a0z.yXwVvUuTtSs', 'citizen', 'Female', '1995-08-15', '123 AB Road', 'Vijay Nagar', 'Indore', '452010'),
('Amit', 'Singh', 'amit.singh@email.com', '$2a$10$wZ4.g.g5c5j6k7l8m9n0bO8h7g6f5e4d3c2b1a0z.yXwVvUuTtSs', 'citizen', 'Male', '1992-04-22', '456 MG Road', 'Old Palasia', 'Indore', '452001'),
('Sonia', 'Verma', 'sonia.verma@email.com', '$2a$10$wZ4.g.g5c5j6k7l8m9n0bO8h7g6f5e4d3c2b1a0z.yXwVvUuTtSs', 'admin', 'Female', '1988-11-01', '789 Ring Road', 'Annapurna', 'Indore', '452009'),
('Rajesh', 'Kumar', 'rajesh.provider@email.com', '$2a$10$wZ4.g.g5c5j6k7l8m9n0bO8h7g6f5e4d3c2b1a0z.yXwVvUuTtSs', 'provider', 'Male', '1985-02-10', '101 Industrial Area', 'Rau', 'Indore', '453331');

-- Populate Citizen Phone Numbers (references Citizen)
INSERT INTO Citizen_Phone_Number (citizen_id, phone_number) VALUES
(1, '9876543210'),
(1, '9876543211'),
(2, '8765432109'),
(3, '7654321098'),
(4, '6543210987');

-- Populate Houses (references Zone)
INSERT INTO House (type, area, zone_id) VALUES
('Apartment', '1200 sqft', 1), -- Vijay Nagar
('Independent', '2000 sqft', 3), -- Old Palasia
('Apartment', '900 sqft', 4);  -- Annapurna

-- Populate Citizen Residency (references Citizen, House)
INSERT INTO Citizen_Residency (citizen_id, house_id) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Populate Vehicles (references Citizen)
INSERT INTO Vehicle (vehicle_no, type, model, owner_id) VALUES
('MP09AB1234', 'Car', 'Honda City', 1),
('MP09CD5678', 'Bike', 'Royal Enfield Classic 350', 2);

-- Populate Service Providers
INSERT INTO Service_Provider (name, service_type, contact_no) VALUES
('Indore Municipal Corporation', 'Utility', '0731-2535566'),
('City Bus Services', 'Transport', '0731-2498877'),
('Apex Hospitals', 'Health Care', '0731-4021111'),
('Airtel', 'Internet', '18001034444');


-- =============================================
-- Step 2: Services and Infrastructure
-- =============================================

-- Base Service Table (references Service_Provider)
INSERT INTO Service (service_name, cost, availability_status, operating_hours, provider_id) VALUES
('Waste Management', 150.00, 'Active', '06:00 - 12:00', 1),
('Water Supply', 200.00, 'Active', '24/7', 1),
('City Bus Route 5', 20.00, 'Active', '07:00 - 22:00', 2),
('Emergency Care', 500.00, 'Active', '24/7', 3),
('Fiber Internet', 799.00, 'Active', '24/7', 4);

-- Utility Sub-Type (references Service)
INSERT INTO Utility (service_id, price_per_unit, unit, billing_date) VALUES
(1, 150, 'monthly', '2025-11-01'),
(2, 8.50, 'KL', '2025-11-05'),
(5, 799, 'monthly', '2025-11-10');

-- Utility Specializations (references Utility)
INSERT INTO Waste_Management (utility_id, collection_schedule, processing_method, type, zone_id) VALUES (1, 'Daily', 'Segregation & Composting', 'Residential', 3);
INSERT INTO Water (utility_id, source, quality_level, supply_hours) VALUES (2, 'Narmada River', 'Potable', '06:00-09:00, 18:00-21:00');
INSERT INTO Internet (utility_id, bandwidth_mbps, coverage_area, service_type) VALUES (3, 200, 'City-wide', 'Fiber');

-- Transport Sub-Type (references Service)
INSERT INTO Transport (service_id, mode) VALUES (3, 'Bus');

-- Transport Routes & Schedules
INSERT INTO Route (start_point, end_point, distance_km) VALUES ('Rajwada', 'Vijay Nagar Square', 8.5);
INSERT INTO Transport_Schedule (transport_id, route_id, days_of_operation, frequency, start_time, end_time, status) VALUES (1, 1, 'Mon-Sun', 'Every 20 mins', '07:00', '22:00', 'On-time');

-- Health Care Sub-Type (references Service)
INSERT INTO Health_Care (service_id, name, capacity, type) VALUES (4, 'Apex Hospital Vijay Nagar', 150, 'Private');
INSERT INTO Doctor (name, specialization) VALUES ('Dr. Gupta', 'Cardiologist'), ('Dr. Patel', 'Orthopedic');
INSERT INTO Doctor_Affiliation (doctor_id, hospital_id) VALUES (1, 1), (2, 1);

-- Base Infrastructure Asset (references Zone)
-- NOTE: Uses PostGIS ST_SetSRID and ST_MakePoint for location.
-- Make sure the PostGIS extension is enabled: CREATE EXTENSION postgis;
INSERT INTO Infrastructure_Asset (zone_id, location) VALUES
(1, ST_SetSRID(ST_MakePoint(75.8937, 22.7533), 4326)), -- Smart Bin in Vijay Nagar
(3, ST_SetSRID(ST_MakePoint(75.8769, 22.7205), 4326)), -- Public Light in Old Palasia
(1, ST_SetSRID(ST_MakePoint(75.8988, 22.7567), 4326)); -- Traffic Sensor in Vijay Nagar

-- Infrastructure Sub-Types (references Infrastructure_Asset)
INSERT INTO Smart_Bin (asset_id, capacity_litres, fill_level_percent, sensor_status, collection_schedule) VALUES (1, 500, 75, 'Active', 'Daily');
INSERT INTO Public_Light (asset_id, status, type, installation_date, power_rating_watts) VALUES (2, 'On', 'LED', '2024-01-10', 120);

-- Base Sensor (references Infrastructure_Asset, Service_Provider)
INSERT INTO Sensor (asset_id, status, provider_id, data_frequency_seconds, last_calibrated, installation_date) VALUES (3, 'Active', 1, 60, '2025-09-01', '2024-03-15');

-- Sensor Specializations (references Sensor)
INSERT INTO Traffic_Sensor (sensor_id) VALUES (1);


-- =============================================
-- Step 3: Readings and Grievances
-- =============================================

-- Sensor Readings (references specialized sensors)
INSERT INTO Traffic_Sensor_Reading (traffic_sensor_id, avg_speed_kmh, congestion_level, vehicle_count) VALUES
(1, 25.5, 0.8, 150),
(1, 22.1, 0.9, 180);

-- Grievances (references Citizen, Service, Service_Provider)
INSERT INTO Grievance (citizen_id, service_id, title, description, location_text, location_coords, status, assigned_provider_id) VALUES
(1, 1, 'Waste not collected today', 'The garbage collection vehicle did not arrive in our area this morning.', 'Near Satya Sai Square, Vijay Nagar', ST_SetSRID(ST_MakePoint(75.8930, 22.7523), 4326), 'Submitted', 1),
(2, 2, 'Leaking water pipeline', 'There is a major water leakage on the main road, causing waterlogging.', 'Near Bapat Square', ST_SetSRID(ST_MakePoint(75.8884, 22.7438), 4326), 'In Progress', 1),
(1, 3, 'Bus was late by 30 mins', 'The city bus route 5 was running very late today, causing inconvenience.', 'Geeta Bhawan Stop', NULL, 'Resolved', 2);


INSERT INTO Announcement (title, content, created_at) VALUES
('Planned Water Supply Interruption in Vijay Nagar', 'Please note that there will be a planned water supply interruption in the Vijay Nagar area on October 8th, 2025, from 10:00 AM to 2:00 PM for pipeline maintenance work. We apologize for the inconvenience.', '2025-10-06 10:00:00+05:30'),
('New City Bus Route Launch', 'We are pleased to announce the launch of a new city bus route (Route 12) connecting Rau to the IT Park, effective from October 10th, 2025. Check the City Bus Services app for the schedule.', '2025-10-05 15:30:00+05:30'),
('Free Health Check-up Camp', 'A free health check-up camp will be organized by Apex Hospitals in Old Palasia on October 12th, 2025, from 9:00 AM to 4:00 PM. All citizens are welcome.', '2025-10-04 11:00:00+05:30');



-- =============================================
-- End of Script
-- =============================================
