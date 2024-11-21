import hbs from 'hbs';

// Register date formatting helper
hbs.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});

// Register equality comparison helper
hbs.registerHelper('eq', function(a, b) {
    return a === b;
});