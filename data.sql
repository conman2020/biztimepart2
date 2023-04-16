CREATE DATABASE biztime;

-- Connect to database
\c biztime;

-- Create industries table
CREATE TABLE industries (
  id serial PRIMARY KEY,
  code text NOT NULL UNIQUE,
  industry text NOT NULL UNIQUE
);

-- Create companies table
CREATE TABLE companies (
  code text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  industry TEXT NOT NULL
);

-- Create invoices table
CREATE TABLE invoices (
  id serial PRIMARY KEY,
  comp_code text NOT NULL,
  amt float NOT NULL,
  paid boolean DEFAULT false NOT NULL,
  add_date date DEFAULT CURRENT_DATE NOT NULL,
  paid_date date,
  CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision)),
  FOREIGN KEY (comp_code) REFERENCES companies(code) ON DELETE CASCADE
);

-- Create company_industry table
CREATE TABLE company_industry (
  id serial PRIMARY KEY,
  company_code text NOT NULL,
  industry_code text NOT NULL,
  FOREIGN KEY (company_code) REFERENCES companies(code) ON DELETE CASCADE,
  FOREIGN KEY (industry_code) REFERENCES industries(code) ON DELETE CASCADE
);

-- Add foreign key constraint to companies table
ALTER TABLE companies
ADD CONSTRAINT companies_industry_fkey FOREIGN KEY (industry) REFERENCES industries(code);

-- Insert data into industries table
INSERT INTO industries (code, industry)
  VALUES ('tech', 'Technology'),
         ('finance', 'Finance');

-- Insert data into companies table
INSERT INTO companies (code, name, description, industry)
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.', 'tech'),
         ('ibm', 'IBM', 'Big blue.', 'tech');

-- Insert data into invoices table
INSERT INTO invoices (comp_code, amt, paid, add_date, paid_date)
  VALUES ('apple', 100, false, current_date, null),
         ('apple', 200, false, current_date, null),
         ('apple', 300, true, '2018-01-01', '2018-01-01'),
         ('ibm', 400, false, current_date, null);

-- Insert data into company_industry table
INSERT INTO company_industry (company_code, industry_code)
  VALUES ('apple', 'tech'),
         ('ibm', 'tech');


         