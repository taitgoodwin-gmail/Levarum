export const CURRENT_BUSINESSES = ['Trades & home services', 'Medical, dental or vet practice', 'Salon, barber or studio', 'Agency or consultancy', 'Online shop', 'Restaurant, cafe or bar', 'Property management', 'Something else'] as const
export const PUBLIC_HOURS = ['Under 5', '5 to 15', '15 to 30', '30 plus'] as const
export const PUBLIC_PAINS = [
 {id:'questions',label:'Answering the same questions over and over',outcome:'Stop re-answering the same customer questions'},
 {id:'invoices',label:'Chasing invoices and payments',outcome:'Get invoices out and followed up consistently'},
 {id:'copying',label:'Copying details between tools by hand',outcome:'Reduce repeated entry between your systems'},
 {id:'booking',label:'Booking people in and sending reminders',outcome:'Reduce booking and reminder back-and-forth'},
 {id:'leads',label:'Following up with new leads',outcome:'Respond to new enquiries consistently'},
] as const
export const CONTRIBUTIONS = ['Building the automations','Front-desk and ops setup','Finding the businesses','Not sure yet'] as const
