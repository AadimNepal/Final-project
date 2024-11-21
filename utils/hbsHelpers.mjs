import hbs from 'hbs';

// Register date formatting helper
hbs.registerHelper('formatDate', (date) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}));

// Register equality comparison helper
hbs.registerHelper('eq', (a, b) => a === b);
