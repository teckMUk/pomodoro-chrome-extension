const websitesToBlock = [
    // "youtube",
    // "facebook"
]

const blockedSites = async () => {
    console.log("block site called")
    for (const domain of websitesToBlock){
        if (window.location.hostname.includes(domain)){
            const overlay = document.createElement('div');
            overlay.id = `block-extension-1`
            // Set styles for the overlay to cover the entire page
            overlay.style.position = 'fixed';
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'black'; // Semi-transparent black
            overlay.style.color = 'white';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.zIndex = 9999; // Ensure it covers everything

            // Set the text content for the overlay
            overlay.textContent = 'Focus on Work Session in Progress';
            document.body.style.overflow = "hidden"
            document.body.appendChild(overlay)
        }
    }
}

blockedSites()

const unblockSites = () => {
    
}