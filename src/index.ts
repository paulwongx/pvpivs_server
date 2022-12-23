import { getPopular } from "./getPopular";



// Execute the script
(async () => {
    // Get the most popular pokemon since last polled
	const popular = await getPopular();
	console.log({popular});

    // Check if the gameMaster has been updated
    
})();
