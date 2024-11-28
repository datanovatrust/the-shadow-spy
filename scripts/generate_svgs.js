// scripts/generate_svgs.js

const fs = require('fs');
const path = require('path');

// Function to generate an SVG file
function generateSVG(filename, width, height, svgContent) {
  const fullSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${svgContent}
</svg>
  `;
  const filePath = path.join(__dirname, '../src/assets/sprites/', filename);
  fs.writeFileSync(filePath, fullSVG.trim());
  console.log(`Generated SVG file: ${filePath}`);
}

// Ensure the sprites directory exists
function ensureSpritesDirectory() {
  const dir = path.join(__dirname, '../src/assets/sprites/');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureSpritesDirectory();

// Generate HUD PET Slot SVG
generateSVG('hud_petSlot.svg', 40, 40, `
  <!-- PET Slot Background -->
  <rect x="0" y="0" width="40" height="40" fill="#333"
        stroke="#FFF" stroke-width="2" rx="5" ry="5" />
`);

// Updated Player with cyberpunk aesthetic
generateSVG('player.svg', 32, 48, `
  <!-- Cyberpunk Character -->
  <defs>
    <linearGradient id="bodyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:0.2"/>
      <stop offset="50%" style="stop-color:#00FFFF;stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#FF10F0;stop-opacity:0.2"/>
    </linearGradient>
  </defs>
  
  <!-- Character Body -->
  <rect x="10" y="15" width="12" height="25" fill="#1A1A2E" />
  <rect x="10" y="15" width="12" height="25" fill="url(#bodyGlow)" />
  
  <!-- Neon Trim -->
  <path d="M10,15 L22,15 L22,40 L10,40" 
        stroke="#FF10F0" 
        stroke-width="1" 
        fill="none" />
  
  <!-- Head with Visor -->
  <circle cx="16" cy="10" r="8" fill="#1A1A2E" />
  <path d="M11,8 L21,8" stroke="#00FFFF" stroke-width="1" />
  <path d="M8,10 Q16,0 24,10" fill="#1A1A2E" stroke="#FF10F0" stroke-width="1" />
  
  <!-- Cyber Visor -->
  <rect x="11" y="7" width="10" height="3" fill="#00FFFF" opacity="0.5" />
  <line x1="11" y1="8.5" x2="21" y2="8.5" stroke="#00FFFF" stroke-width="0.5" />
  
  <!-- Tech Details -->
  <line x1="10" y1="20" x2="22" y2="20" stroke="#00FFFF" stroke-width="0.5" opacity="0.5" />
  <line x1="10" y1="30" x2="22" y2="30" stroke="#00FFFF" stroke-width="0.5" opacity="0.5" />
`);

// Generate PET Skill Icons
generateSVG('petSkill_differentialPrivacy.svg', 32, 32, `
  <!-- PET Skill Icon -->
  <circle cx="16" cy="16" r="14" fill="#00CED1" />
  <text x="16" y="22" font-size="16" text-anchor="middle" fill="#FFF">&#916;</text>
`);

generateSVG('petSkill_federatedLearning.svg', 32, 32, `
  <!-- PET Skill Icon -->
  <circle cx="16" cy="16" r="14" fill="#32CD32" />
  <text x="16" y="22" font-size="16" text-anchor="middle" fill="#FFF">FL</text>
`);

generateSVG('petSkill_homomorphicEncryption.svg', 32, 32, `
  <!-- PET Skill Icon -->
  <circle cx="16" cy="16" r="14" fill="#FF8C00" />
  <text x="16" y="22" font-size="16" text-anchor="middle" fill="#FFF">HE</text>
`);

generateSVG('petSkill_polymorphicEncryption.svg', 32, 32, `
  <!-- PET Skill Icon -->
  <circle cx="16" cy="16" r="14" fill="#9400D3" />
  <text x="16" y="22" font-size="16" text-anchor="middle" fill="#FFF">PE</text>
`);

// Generate Updated Attack Animation SVG (with additional lines)
generateSVG('attackAnimation.svg', 32, 32, `
  <!-- Attack Animation -->
  <circle cx="16" cy="16" r="15" stroke="#FFD700" stroke-width="2" fill="none" />
  <line x1="16" y1="1" x2="16" y2="31" stroke="#FFD700" stroke-width="2" />
  <line x1="1" y1="16" x2="31" y2="16" stroke="#FFD700" stroke-width="2" />
  <!-- Additional Animation Lines -->
  <line x1="5" y1="5" x2="27" y2="27" stroke="#FFD700" stroke-width="2" />
  <line x1="27" y1="5" x2="5" y2="27" stroke="#FFD700" stroke-width="2" />
`);

// Generate PET Skill Icons (New)
generateSVG('petSkill_differentialPrivacy.svg', 32, 32, `
  <!-- PET Skill Icon -->
  <circle cx="16" cy="16" r="14" fill="#00CED1" />
  <text x="16" y="22" font-size="16" text-anchor="middle" fill="#FFF">&#916;</text>
`);

// Updated Basic Goon with cyber theme
generateSVG('basicGoon.svg', 32, 48, `
  <!-- Cyber Goon -->
  <defs>
    <linearGradient id="goonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF0000;stop-opacity:0.2"/>
      <stop offset="50%" style="stop-color:#FF4444;stop-opacity:0.3"/>
      <stop offset="100%" style="stop-color:#FF0000;stop-opacity:0.2"/>
    </linearGradient>
  </defs>
  
  <!-- Goon Body -->
  <rect x="8" y="20" width="16" height="24" fill="#2F1F2F" />
  <rect x="8" y="20" width="16" height="24" fill="url(#goonGlow)" />
  
  <!-- Body Trim -->
  <path d="M8,20 L24,20 L24,44 L8,44" 
        stroke="#FF0000" 
        stroke-width="1" 
        fill="none" />
  
  <!-- Head -->
  <circle cx="16" cy="14" r="10" fill="#2F1F2F" />
  
  <!-- Cyber Eyes -->
  <rect x="10" y="12" width="4" height="2" fill="#FF0000" />
  <rect x="18" y="12" width="4" height="2" fill="#FF0000" />
  
  <!-- Tech Details -->
  <line x1="8" y1="25" x2="24" y2="25" stroke="#FF0000" stroke-width="0.5" opacity="0.5" />
  <line x1="8" y1="35" x2="24" y2="35" stroke="#FF0000" stroke-width="0.5" opacity="0.5" />
`);

// Updated Big Mob Goon
generateSVG('bigMobGoon.svg', 48, 64, `
  <!-- Big Cyber Goon -->
  <defs>
    <linearGradient id="bigGoonGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF0000;stop-opacity:0.3"/>
      <stop offset="50%" style="stop-color:#FF4444;stop-opacity:0.4"/>
      <stop offset="100%" style="stop-color:#FF0000;stop-opacity:0.3"/>
    </linearGradient>
  </defs>
  
  <!-- Main Body -->
  <rect x="12" y="28" width="24" height="36" fill="#3F1F1F" />
  <rect x="12" y="28" width="24" height="36" fill="url(#bigGoonGlow)" />
  
  <!-- Body Armor Plates -->
  <path d="M12,28 L36,28 L36,64 L12,64" 
        stroke="#FF0000" 
        stroke-width="2" 
        fill="none" />
  
  <!-- Head -->
  <circle cx="24" cy="20" r="16" fill="#3F1F1F" />
  
  <!-- Cyber Enhancement -->
  <path d="M14,20 L34,20" stroke="#FF0000" stroke-width="2" />
  
  <!-- Enhanced Eyes -->
  <rect x="16" y="18" width="6" height="3" fill="#FF0000" />
  <rect x="26" y="18" width="6" height="3" fill="#FF0000" />
  
  <!-- Tech Details -->
  <line x1="12" y1="35" x2="36" y2="35" stroke="#FF0000" stroke-width="1" opacity="0.7" />
  <line x1="12" y1="45" x2="36" y2="45" stroke="#FF0000" stroke-width="1" opacity="0.7" />
  
  <!-- Power Core -->
  <circle cx="24" cy="40" r="3" fill="#FF0000" opacity="0.8" />
`);

// Generate Data Breach SVG
generateSVG('dataBreach.svg', 32, 32, `
  <!-- Data Breach Icon -->
  <rect x="4" y="4" width="24" height="24" fill="#8A2BE2" rx="4" ry="4" />
  <text x="16" y="22" font-size="16" text-anchor="middle" fill="#FFFFFF" font-family="Arial">&#9888;</text>
`);

// Generate Targeted Advertisement SVG
generateSVG('ad.svg', 32, 32, `
  <!-- Ad Background -->
  <rect x="0" y="0" width="32" height="32" fill="#FFD700" />
  <!-- Ad Symbol -->
  <text x="16" y="20" font-size="18" text-anchor="middle" fill="#000" font-family="Arial">&#128181;</text>
`);

// Updated Ground Platform
generateSVG('ground.svg', 64, 16, `
  <!-- Cyberpunk Platform -->
  <defs>
    <linearGradient id="platformGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#291D54"/>
      <stop offset="50%" style="stop-color:#4B1537"/>
      <stop offset="100%" style="stop-color:#291D54"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="64" height="16" fill="url(#platformGradient)"/>
  <rect x="0" y="0" width="64" height="2" fill="#FF10F0"/>
  <rect x="0" y="14" width="64" height="2" fill="#FF10F0"/>
`);

// Sky with cyber grid
generateSVG('background_sky.svg', 800, 600, `
  <!-- Cyberpunk Sky -->
  <defs>
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#120458;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#291D54;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4B1537;stop-opacity:1" />
    </linearGradient>
    <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FF10F0" stroke-width="0.5" opacity="0.3"/>
    </pattern>
  </defs>
  <rect x="0" y="0" width="800" height="600" fill="url(#skyGradient)" />
  <rect x="0" y="0" width="800" height="600" fill="url(#grid)" />
  
  <!-- Cyber Moon -->
  <circle cx="600" cy="150" r="60" fill="#FF10F0" opacity="0.5" />
  <circle cx="600" cy="150" r="55" fill="#120458" />
  <circle cx="600" cy="150" r="50" fill="#FF10F0" opacity="0.3" />
`);

// Distant Mountains Layer
generateSVG('background_mountains.svg', 800, 600, `
  <!-- Mountains -->
  <polygon points="0,600 200,300 400,600" fill="#6B8E23" />
  <polygon points="300,600 500,250 700,600" fill="#556B2F" />
  <polygon points="600,600 800,350 1000,600" fill="#6B8E23" />
`);

// Closer Hills Layer
generateSVG('background_hills.svg', 800, 600, `
  <!-- Hills -->
  <ellipse cx="200" cy="600" rx="300" ry="100" fill="#228B22" />
  <ellipse cx="600" cy="600" rx="300" ry="120" fill="#2E8B57" />
`);

// Distant Skyscrapers
generateSVG('background_buildings_far.svg', 800, 600, `
  <!-- Far Buildings -->
  <g opacity="0.8">
    <!-- Building 1 -->
    <rect x="50" y="200" width="100" height="400" fill="#291D54" />
    <rect x="60" y="220" width="80" height="360" fill="#120458" />
    <rect x="70" y="200" width="60" height="400" fill="#4B1537" />
    
    <!-- Building 2 -->
    <rect x="200" y="150" width="80" height="450" fill="#291D54" />
    <rect x="210" y="170" width="60" height="410" fill="#120458" />
    <rect x="220" y="150" width="40" height="450" fill="#4B1537" />
    
    <!-- Building 3 -->
    <rect x="350" y="100" width="120" height="500" fill="#291D54" />
    <rect x="360" y="120" width="100" height="460" fill="#120458" />
    <rect x="370" y="100" width="80" height="500" fill="#4B1537" />
    
    <!-- Add more buildings with similar pattern -->
  </g>
  
  <!-- Building Windows -->
  <g fill="#FF10F0" opacity="0.5">
    <rect x="75" y="220" width="5" height="5" />
    <rect x="75" y="240" width="5" height="5" />
    <!-- Add more windows in a grid pattern -->
  </g>
`);

// Trees Layer
generateSVG('background_trees.svg', 800, 600, `
  <!-- Trees -->
  <!-- Tree 1 -->
  <rect x="100" y="400" width="20" height="100" fill="#8B4513" />
  <circle cx="110" cy="380" r="40" fill="#006400" />
  <!-- Tree 2 -->
  <rect x="300" y="420" width="20" height="80" fill="#8B4513" />
  <circle cx="310" cy="400" r="35" fill="#006400" />
  <!-- Tree 3 -->
  <rect x="500" y="410" width="20" height="90" fill="#8B4513" />
  <circle cx="510" cy="390" r="38" fill="#006400" />
`);

// Mid-ground Platforms
generateSVG('background_platforms.svg', 800, 600, `
  <!-- Cyberpunk Platforms -->
  <g opacity="0.9">
    <path d="M100,400 L300,400 L320,420 L80,420 Z" fill="#FF10F0" opacity="0.3"/>
    <path d="M400,350 L600,350 L620,370 L380,370 Z" fill="#FF10F0" opacity="0.3"/>
    <path d="M200,500 L400,500 L420,520 L180,520 Z" fill="#FF10F0" opacity="0.3"/>
  </g>
`);

// Animated Clouds Layer (using multiple images for animation)
generateSVG('background_clouds.svg', 800, 600, `
  <!-- Clouds -->
  <g id="cloud1">
    <circle cx="100" cy="100" r="20" fill="#FFF" />
    <circle cx="120" cy="90" r="25" fill="#FFF" />
    <circle cx="140" cy="100" r="20" fill="#FFF" />
  </g>
  <g id="cloud2">
    <circle cx="400" cy="150" r="30" fill="#FFF" />
    <circle cx="430" cy="140" r="35" fill="#FFF" />
    <circle cx="470" cy="150" r="30" fill="#FFF" />
  </g>
`);

// Foreground Elements
generateSVG('background_foreground.svg', 800, 600, `
  <!-- Foreground Neon Elements -->
  <g opacity="0.8">
    <path d="M0,550 Q200,500 400,550 T800,550" stroke="#FF10F0" stroke-width="2" fill="none"/>
    <path d="M0,560 Q200,510 400,560 T800,560" stroke="#00FFFF" stroke-width="2" fill="none"/>
  </g>
  
  <!-- Vertical Light Beams -->
  <g opacity="0.2">
    <rect x="100" y="0" width="10" height="600" fill="url(#beamGradient)"/>
    <rect x="400" y="0" width="10" height="600" fill="url(#beamGradient)"/>
    <rect x="700" y="0" width="10" height="600" fill="url(#beamGradient)"/>
  </g>
  
  <defs>
    <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:#FF10F0;stop-opacity:0"/>
    </linearGradient>
  </defs>
`);

// Moving Platform
generateSVG('movingPlatform.svg', 64, 16, `
  <!-- Cyberpunk Moving Platform -->
  <defs>
    <linearGradient id="movingPlatformGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF10F0"/>
      <stop offset="50%" style="stop-color:#00FFFF"/>
      <stop offset="100%" style="stop-color:#FF10F0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="64" height="16" fill="#291D54"/>
  <rect x="2" y="2" width="60" height="12" fill="url(#movingPlatformGradient)" opacity="0.5"/>
  <rect x="0" y="0" width="64" height="2" fill="#00FFFF"/>
  <rect x="0" y="14" width="64" height="2" fill="#00FFFF"/>
`);

// Generate Privacy Enhancing Technologies (PETs)

// Differential Privacy Shield SVG
generateSVG('pet_differentialPrivacyShield.svg', 32, 32, `
  <!-- Shield Outline -->
  <path d="M16,4 L28,12 L24,28 L8,28 L4,12 Z" fill="#00CED1" stroke="#000" stroke-width="2" />
  <!-- Lock Icon -->
  <rect x="13" y="12" width="6" height="8" fill="#FFF" />
  <path d="M16,10 A2,2 0 0,1 18,12" stroke="#FFF" stroke-width="2" fill="none" />
`);

// Federated Learning Network SVG
generateSVG('pet_federatedLearningNetwork.svg', 32, 32, `
  <!-- Nodes -->
  <circle cx="16" cy="8" r="4" fill="#32CD32" />
  <circle cx="8" cy="24" r="4" fill="#32CD32" />
  <circle cx="24" cy="24" r="4" fill="#32CD32" />
  <!-- Connections -->
  <line x1="16" y1="8" x2="8" y2="24" stroke="#000" stroke-width="2" />
  <line x1="16" y1="8" x2="24" y2="24" stroke="#000" stroke-width="2" />
  <line x1="8" y1="24" x2="24" y2="24" stroke="#000" stroke-width="2" />
`);

// Homomorphic Encryption Blast SVG
generateSVG('pet_homomorphicEncryptionBlast.svg', 32, 32, `
  <!-- Explosion Background -->
  <circle cx="16" cy="16" r="14" fill="#FF8C00" />
  <!-- Lock Icon -->
  <rect x="13" y="12" width="6" height="8" fill="#FFF" />
  <path d="M16,10 A2,2 0 0,1 18,12" stroke="#FFF" stroke-width="2" fill="none" />
`);

// Fake Moustache Disguise SVG
generateSVG('pet_fakeMoustache.svg', 32, 32, `
  <!-- Moustache -->
  <path d="M8,16 C10,12 14,12 16,16 C18,12 22,12 24,16 Q16,20 8,16 Z" fill="#000" />
`);

// Polymorphic Encryption Cloak SVG
generateSVG('pet_polymorphicCloak.svg', 32, 48, `
  <!-- Cloak -->
  <path d="M16,8 Q8,16 8,40 H24 Q24,16 16,8 Z" fill="url(#cloakGradient)" />
  <!-- Gradient Definition -->
  <defs>
    <linearGradient id="cloakGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1E90FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9400D3;stop-opacity:1" />
    </linearGradient>
  </defs>
`);

// Generate HUD Elements

// Epsilon Meter SVG
generateSVG('hud_epsilonMeter.svg', 200, 20, `
  <!-- Background -->
  <rect x="0" y="0" width="200" height="20" fill="#555" rx="10" ry="10" />
  <!-- Epsilon Bar Placeholder (to be manipulated in code) -->
  <rect id="epsilonBar" x="2" y="2" width="196" height="16"
        fill="#00CED1" rx="8" ry="8" />
  <!-- Epsilon Text -->
  <text x="100" y="15" font-size="12" text-anchor="middle" fill="#FFF"
        font-family="Arial">Epsilon</text>
`);

// Health Bar SVG
generateSVG('hud_healthBar.svg', 200, 20, `
  <!-- Background -->
  <rect x="0" y="0" width="200" height="20" fill="#555" rx="10" ry="10" />
  <!-- Health Hearts Placeholder -->
  <!-- Hearts will be drawn in code -->
`);

// Generate Boss SVG

// Mob Boss SVG
generateSVG('mobBoss.svg', 64, 80, `
  <!-- Boss Body -->
  <rect x="16" y="40" width="32" height="40" fill="#000" />
  <!-- Boss Head -->
  <circle cx="32" cy="24" r="16" fill="#696969" />
  <!-- Boss Hat -->
  <rect x="16" y="8" width="32" height="8" fill="#000" />
  <rect x="24" y="0" width="16" height="8" fill="#000" />
  <!-- Boss Eyes -->
  <rect x="24" y="20" width="4" height="4" fill="#FFF" />
  <rect x="36" y="20" width="4" height="4" fill="#FFF" />
  <!-- Boss Tie -->
  <polygon points="32,40 28,50 36,50" fill="#B22222" />
`);

// Updated Boss Goon
generateSVG('bossGoon.svg', 64, 80, `
  <!-- Cyber Boss -->
  <defs>
    <linearGradient id="bossGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF0000;stop-opacity:0.4"/>
      <stop offset="50%" style="stop-color:#FF4444;stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:#FF0000;stop-opacity:0.4"/>
    </linearGradient>
    <filter id="cyborglow">
      <feGaussianBlur stdDeviation="2" />
    </filter>
  </defs>
  
  <!-- Enhanced Body -->
  <rect x="16" y="40" width="32" height="40" fill="#4F1F1F" />
  <rect x="16" y="40" width="32" height="40" fill="url(#bossGlow)" />
  
  <!-- Armor Plating -->
  <path d="M16,40 L48,40 L48,80 L16,80" 
        stroke="#FF0000" 
        stroke-width="3" 
        fill="none" />
  
  <!-- Cyber Head -->
  <circle cx="32" cy="24" r="16" fill="#4F1F1F" />
  
  <!-- Neural Network -->
  <path d="M20,24 L44,24" stroke="#FF0000" stroke-width="3" />
  
  <!-- Enhanced Vision -->
  <rect x="22" y="22" width="8" height="4" fill="#FF0000" />
  <rect x="34" y="22" width="8" height="4" fill="#FF0000" />
  
  <!-- Power Lines -->
  <line x1="16" y1="50" x2="48" y2="50" stroke="#FF0000" stroke-width="2" opacity="0.8" />
  <line x1="16" y1="60" x2="48" y2="60" stroke="#FF0000" stroke-width="2" opacity="0.8" />
  
  <!-- Central Core -->
  <circle cx="32" cy="55" r="4" fill="#FF0000" opacity="0.9" filter="url(#cyborglow)" />
  
  <!-- Energy Field -->
  <circle cx="32" cy="55" r="6" stroke="#FF0000" stroke-width="1" fill="none" opacity="0.5" />
`);

// Generate Background Elements

// Cityscape Background SVG
generateSVG('background_cityscape.svg', 800, 600, `
  <!-- Sky -->
  <rect x="0" y="0" width="800" height="600" fill="#1E90FF" />
  <!-- Buildings -->
  <rect x="0" y="300" width="100" height="300" fill="#2F4F4F" />
  <rect x="120" y="250" width="80" height="350" fill="#2F4F4F" />
  <rect x="220" y="320" width="150" height="280" fill="#2F4F4F" />
  <rect x="390" y="200" width="100" height="400" fill="#2F4F4F" />
  <rect x="510" y="280" width="90" height="320" fill="#2F4F4F" />
  <rect x="620" y="240" width="120" height="360" fill="#2F4F4F" />
  <!-- Windows -->
  <g fill="#FFD700">
    <rect x="30" y="320" width="10" height="15" />
    <rect x="60" y="350" width="10" height="15" />
    <!-- Add more windows as needed -->
  </g>
`);

// Generate Collectible Items

// Health Pack SVG
generateSVG('item_healthPack.svg', 24, 24, `
  <!-- Health Pack -->
  <rect x="2" y="2" width="20" height="20" fill="#FF0000" rx="4" ry="4" />
  <!-- Cross Symbol -->
  <rect x="11" y="6" width="2" height="12" fill="#FFF" />
  <rect x="6" y="11" width="12" height="2" fill="#FFF" />
`);

// Epsilon Reduction Item SVG
generateSVG('item_epsilonReduction.svg', 24, 24, `
  <!-- Epsilon Symbol -->
  <circle cx="12" cy="12" r="10" fill="#00CED1" />
  <text x="12" y="16" font-size="16" text-anchor="middle" fill="#FFF" font-family="Arial">&#603;</text>
`);

// Generate Minigame Icons

// Differential Privacy Minigame Icon SVG
generateSVG('minigame_differentialPrivacy.svg', 32, 32, `
  <!-- Icon Background -->
  <rect x="0" y="0" width="32" height="32" fill="#00CED1" rx="8" ry="8" />
  <!-- Question Mark -->
  <text x="16" y="22" font-size="20" text-anchor="middle" fill="#FFF" font-family="Arial">?</text>
`);

// Homomorphic Encryption Minigame Icon SVG
generateSVG('minigame_homomorphicEncryption.svg', 32, 32, `
  <!-- Icon Background -->
  <rect x="0" y="0" width="32" height="32" fill="#FF8C00" rx="8" ry="8" />
  <!-- Puzzle Piece -->
  <path d="M8,12 L12,12 L12,8 L20,8 L20,12 L24,12 L24,20 L20,20 L20,24 L12,24 L12,20 L8,20 Z" fill="#FFF" />
`);

// Generate Finish Flag SVG
generateSVG('finishFlag.svg', 64, 128, `
  <!-- Flag Pole -->
  <rect x="30" y="0" width="4" height="128" fill="#8B4513" />
  <!-- Flag -->
  <polygon points="34,0 64,16 34,32" fill="#FFD700" />
`);

// Generate Projectile SVG
generateSVG('projectile.svg', 16, 16, `
  <!-- Projectile -->
  <defs>
    <radialGradient id="projectileGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#FF10F0;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <circle cx="8" cy="8" r="8" fill="url(#projectileGradient)" />
`);

// Weapon Power-up SVGs
generateSVG('weapon_powerup_1.svg', 32, 32, `
  <!-- Weapon Power-up Level 1 -->
  <rect x="8" y="8" width="16" height="16" fill="#FFD700" />
`);

generateSVG('weapon_powerup_2.svg', 32, 32, `
  <!-- Weapon Power-up Level 2 -->
  <rect x="4" y="4" width="24" height="24" fill="#FF8C00" />
`);

generateSVG('weapon_powerup_3.svg', 32, 32, `
  <!-- Weapon Power-up Level 3 -->
  <rect x="0" y="0" width="32" height="32" fill="#FF0000" />
`);

// Generate Heart SVG
generateSVG('heart.svg', 24, 24, `
  <!-- Heart Shape -->
  <path d="M12 21s-6-4.35-10-10C2 5 6 1 12 5.5C18 1 22 5 22 11C18 16.65 12 21 12 21Z" fill="#FF0000" />
`);

// Generate Platform Glow effect
generateSVG('platform_glow.svg', 64, 32, `
  <!-- Platform Glow Effect -->
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:#FF10F0;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <ellipse cx="32" cy="16" rx="32" ry="16" fill="url(#glow)" />
`);

// Generate City Light
generateSVG('city_light.svg', 16, 16, `
  <!-- City Light Effect -->
  <defs>
    <radialGradient id="cityLightGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:1"/>
      <stop offset="50%" style="stop-color:#FF10F0;stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:#FF10F0;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <circle cx="8" cy="8" r="8" fill="url(#cityLightGlow)" />
  <circle cx="8" cy="8" r="2" fill="#FF10F0" />
`);

// Generate Neon Trail
generateSVG('neon_trail.svg', 64, 16, `
  <!-- Neon Trail Effect -->
  <defs>
    <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:0"/>
      <stop offset="50%" style="stop-color:#FF10F0;stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:#FF10F0;stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="64" height="16" fill="url(#trailGradient)" />
`);

// Generate Particle SVG
generateSVG('particle.svg', 4, 4, `
  <circle cx="2" cy="2" r="2" fill="#FFFFFF" />
`);
