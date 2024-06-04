const knex = require('../knex');

// Function to get places with deals on a specific day of the week
const getPlacesByDay = async (req, res) => {
    const { day_of_week } = req.query;
    if (!day_of_week) {
        return res.status(400).json({ error: 'day_of_week query parameter is required' });
    }
    try {
        const places = await knex('deals')
            .join('places', 'deals.place_id', '=', 'places.id')
            .select(
                'places.id as place_id',
                'places.name as place_name',
                'places.address',
                'places.contact_info',
                'places.website',
                'deals.day_of_week',
                'deals.start_time',
                'deals.end_time',
                'deals.item'
            )
            .whereRaw('FIND_IN_SET(?, REPLACE(deals.day_of_week, " ", ""))', [day_of_week]); //FIND to find day in the string day, REPLACE to delete blank space between week days.

            
        // Parse the 'item' field from JSON string to JSON object
        const formattedPlaces = places.map(place => {
            return {
                ...place,
                item: JSON.parse(place.item)
            };
        });

        res.json(formattedPlaces);
    } catch (error) {
        console.error('Error fetching places:', error);
        res.status(500).json({ error: 'Failed to fetch places' });
    }
};

module.exports = { getPlacesByDay };
