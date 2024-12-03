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

// Generate Player Character SVG
generateSVG('player.svg', 32, 48, `
  <!-- Pixel Art Player Character -->
  <!-- Standing Frame -->
  <g id="standing">
    <!-- Trench Coat -->
    <rect x="12" y="24" width="8" height="20" fill="#D4C4A8" />
    <rect x="11" y="24" width="10" height="4" fill="#BEB19A" />
    
    <!-- Suit -->
    <rect x="13" y="20" width="6" height="8" fill="#2F2F2F" />
    
    <!-- Head -->
    <rect x="13" y="16" width="6" height="6" fill="#E6D5C1" />
    
    <!-- Sunglasses -->
    <rect x="13" y="18" width="6" height="2" fill="#000000" />
    
    <!-- Hair -->
    <rect x="13" y="16" width="6" height="2" fill="#4A3C31" />
    
    <!-- Shoes -->
    <rect x="12" y="44" width="4" height="2" fill="#000000" />
  </g>

  <!-- Running Frame 1 -->
  <g id="run1" visibility="hidden">
    <!-- Trench Coat -->
    <rect x="12" y="24" width="8" height="18" fill="#D4C4A8" />
    <rect x="11" y="24" width="10" height="4" fill="#BEB19A" />
    
    <!-- Legs -->
    <rect x="12" y="42" width="3" height="4" fill="#2F2F2F" />
    <rect x="17" y="42" width="3" height="4" fill="#2F2F2F" />
    
    <!-- Same upper body as standing -->
    <rect x="13" y="20" width="6" height="8" fill="#2F2F2F" />
    <rect x="13" y="16" width="6" height="6" fill="#E6D5C1" />
    <rect x="13" y="18" width="6" height="2" fill="#000000" />
    <rect x="13" y="16" width="6" height="2" fill="#4A3C31" />
  </g>

  <!-- Running Frame 2 -->
  <g id="run2" visibility="hidden">
    <!-- Trench Coat -->
    <rect x="12" y="24" width="8" height="18" fill="#D4C4A8" />
    <rect x="11" y="24" width="10" height="4" fill="#BEB19A" />
    
    <!-- Legs -->
    <rect x="14" y="42" width="3" height="4" fill="#2F2F2F" />
    <rect x="15" y="42" width="3" height="4" fill="#2F2F2F" />
    
    <!-- Same upper body as standing -->
    <rect x="13" y="20" width="6" height="8" fill="#2F2F2F" />
    <rect x="13" y="16" width="6" height="6" fill="#E6D5C1" />
    <rect x="13" y="18" width="6" height="2" fill="#000000" />
    <rect x="13" y="16" width="6" height="2" fill="#4A3C31" />
  </g>

  <!-- Animation -->
  <style>
    @keyframes run {
      0% { visibility: visible; }
      33% { visibility: hidden; }
      66% { visibility: hidden; }
      100% { visibility: visible; }
    }
    #run1 {
      animation: run 0.3s steps(1) infinite;
    }
    #run2 {
      animation: run 0.3s steps(1) infinite;
      animation-delay: 0.15s;
    }
  </style>
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

// Generate Menu Background SVG
generateSVG('menu_background.svg', 800, 600, `
  <!-- Menu Background -->
  <defs>
    <linearGradient id="menuGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0c29;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#302b63;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#24243e;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="800" height="600" fill="url(#menuGradient)" />
  <!-- Optional: Add decorative elements like logos or patterns -->
  <text x="400" y="200" font-size="48" text-anchor="middle" fill="#FFFFFF" font-family="Arial">Game Title</text>
`);

// Generate Start Button SVG
generateSVG('start_button.svg', 200, 80, `
  <!-- Start Button -->
  <rect x="0" y="0" width="200" height="80" rx="20" ry="20" fill="#FF10F0" />
  <text x="100" y="50" font-size="32" text-anchor="middle" fill="#FFFFFF" font-family="Arial" alignment-baseline="middle">Start</text>
`);

// --- New SVG Assets for the Boat-Themed Level ---

// Generate Sailboat SVG
generateSVG('sailboat.svg', 128, 128, `
  <!-- Sailboat -->
  <!-- Hull -->
  <path d="M16,96 L112,96 L80,112 L48,112 Z" fill="#8B4513" stroke="#5C3317" stroke-width="2" />
  <!-- Mast -->
  <rect x="64" y="32" width="4" height="64" fill="#5C3317" />
  <!-- Sail -->
  <path d="M68,32 L68,96 L96,64 Z" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="2" />
  <!-- Flag -->
  <path d="M66,32 L66,24 L80,28 L66,32 Z" fill="#FF0000" stroke="#CC0000" stroke-width="1" />
`);

// Generate Wooden Platform SVG
generateSVG('wooden_platform.svg', 128, 32, `
  <!-- Wooden Platform -->
  <rect x="0" y="0" width="128" height="32" fill="#DEB887" />
  <!-- Plank Lines -->
  <line x1="32" y1="0" x2="32" y2="32" stroke="#A0522D" stroke-width="2" />
  <line x1="64" y1="0" x2="64" y2="32" stroke="#A0522D" stroke-width="2" />
  <line x1="96" y1="0" x2="96" y2="32" stroke="#A0522D" stroke-width="2" />
  <!-- Wood Grain -->
  <path d="M0,8 Q16,12 32,8 T64,8 T96,8 T128,8" stroke="#CD853F" stroke-width="1" fill="none" />
  <path d="M0,24 Q16,20 32,24 T64,24 T96,24 T128,24" stroke="#CD853F" stroke-width="1" fill="none" />
`);

// Generate River Background SVG
generateSVG('background_river.svg', 800, 600, `
  <!-- River Background -->
  <rect x="0" y="0" width="800" height="600" fill="#87CEEB" />
  <!-- Water -->
  <rect x="0" y="300" width="800" height="300" fill="#1E90FF" />
  <!-- Waves -->
  <path d="M0,350 Q50,340 100,350 T200,350 T300,350 T400,350 T500,350 T600,350 T700,350 T800,350" stroke="#ADD8E6" stroke-width="2" fill="none" />
  <path d="M0,370 Q50,360 100,370 T200,370 T300,370 T400,370 T500,370 T600,370 T700,370 T800,370" stroke="#ADD8E6" stroke-width="2" fill="none" opacity="0.7" />
`);

// Generate Whimsical Tree SVG
generateSVG('tree.svg', 64, 128, `
  <!-- Tree -->
  <!-- Trunk -->
  <rect x="28" y="64" width="8" height="64" fill="#8B4513" />
  <!-- Leaves -->
  <circle cx="32" cy="48" r="32" fill="#32CD32" />
  <!-- Additional Leaves for Whimsy -->
  <circle cx="16" cy="64" r="16" fill="#32CD32" />
  <circle cx="48" cy="64" r="16" fill="#32CD32" />
`);

// Generate Cloud SVG
generateSVG('cloud.svg', 128, 64, `
  <!-- Whimsical Cloud -->
  <circle cx="32" cy="32" r="20" fill="#FFFFFF" />
  <circle cx="52" cy="32" r="25" fill="#FFFFFF" />
  <circle cx="72" cy="32" r="20" fill="#FFFFFF" />
  <circle cx="52" cy="22" r="18" fill="#FFFFFF" />
`);

// Generate Sun SVG
generateSVG('sun.svg', 64, 64, `
  <!-- Sun -->
  <circle cx="32" cy="32" r="16" fill="#FFD700" />
  <!-- Rays -->
  ${[...Array(12)].map((_, i) => {
  const angle = (i * 30) * (Math.PI / 180);
  const x1 = 32 + Math.cos(angle) * 20;
  const y1 = 32 + Math.sin(angle) * 20;
  const x2 = 32 + Math.cos(angle) * 28;
  const y2 = 32 + Math.sin(angle) * 28;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#FFD700" stroke-width="2" />`;
}).join('\n')}
`);

// Generate Fish Enemy SVG
generateSVG('fish_enemy.svg', 64, 32, `
  <!-- Fish Enemy -->
  <!-- Body -->
  <ellipse cx="32" cy="16" rx="28" ry="12" fill="#FF4500" />
  <!-- Tail -->
  <polygon points="4,16 0,8 0,24" fill="#FF4500" />
  <!-- Eye -->
  <circle cx="40" cy="12" r="4" fill="#FFFFFF" />
  <circle cx="40" cy="12" r="2" fill="#000000" />
  <!-- Fin -->
  <polygon points="20,8 28,16 20,24" fill="#FF6347" />
`);

// Generate Lily Pad Platform SVG
generateSVG('lily_pad.svg', 64, 32, `
  <!-- Lily Pad Platform -->
  <ellipse cx="32" cy="16" rx="30" ry="14" fill="#32CD32" />
  <path d="M32,16 L32,2 A30,14 0 0,0 32,16" fill="#2E8B57" />
`);

// Generate Wooden Bridge or Dock SVG
generateSVG('dock.svg', 256, 64, `
  <!-- Wooden Dock -->
  <rect x="0" y="32" width="256" height="32" fill="#A0522D" />
  <!-- Planks -->
  ${[...Array(16)].map((_, i) => {
  const x = i * 16;
  return `<line x1="${x}" y1="32" x2="${x}" y2="64" stroke="#8B4513" stroke-width="2" />`;
}).join('\n')}
  <!-- Support Beams -->
  <rect x="0" y="64" width="8" height="32" fill="#8B4513" />
  <rect x="248" y="64" width="8" height="32" fill="#8B4513" />
`);

// Generate Animated Water SVG
generateSVG('animated_water.svg', 800, 200, `
  <!-- Animated Water -->
  <defs>
    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1E90FF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#00BFFF;stop-opacity:1" />
    </linearGradient>
    <path id="wavePath" d="M0,50 Q50,70 100,50 T200,50 T300,50 T400,50 T500,50 T600,50 T700,50 T800,50 V200 H0 Z" />
    <mask id="waveMask">
      <rect x="0" y="0" width="800" height="200" fill="white" />
      <use href="#wavePath" fill="black" />
    </mask>
  </defs>
  <rect x="0" y="0" width="800" height="200" fill="url(#waterGradient)" mask="url(#waveMask)">
    <animateTransform attributeName="transform" type="translate" from="0,0" to="-100,0" dur="5s" repeatCount="indefinite" />
  </rect>
`);

// Generate Bird SVG with Simple Animation
generateSVG('bird.svg', 64, 64, `
  <!-- Bird -->
  <g>
    <!-- Body -->
    <ellipse cx="32" cy="32" rx="16" ry="12" fill="#FFD700" />
    <!-- Wing -->
    <path id="wing" d="M32,32 Q20,20 24,32 Q20,44 32,32" fill="#FFA500" />
    <!-- Eye -->
    <circle cx="38" cy="28" r="2" fill="#000" />
    <!-- Beak -->
    <polygon points="44,32 38,30 38,34" fill="#FF8C00" />
  </g>
  <!-- Wing Flap Animation -->
  <animateTransform href="#wing" attributeName="transform" type="rotate" from="0 32 32" to="10 32 32" dur="0.5s" repeatCount="indefinite" direction="alternate" />
`);

// Generate Butterfly SVG with Simple Animation
generateSVG('butterfly.svg', 64, 64, `
  <!-- Butterfly -->
  <g>
    <!-- Body -->
    <rect x="30" y="28" width="4" height="8" fill="#8B4513" />
    <!-- Left Wing -->
    <path id="leftWing" d="M32,32 C20,20 10,30 32,40" fill="#FF69B4" />
    <!-- Right Wing -->
    <path id="rightWing" d="M32,32 C44,20 54,30 32,40" fill="#FF69B4" />
    <!-- Antennae -->
    <line x1="32" y1="28" x2="28" y2="20" stroke="#8B4513" stroke-width="2" />
    <line x1="32" y1="28" x2="36" y2="20" stroke="#8B4513" stroke-width="2" />
  </g>
  <!-- Wing Flap Animation -->
  <animateTransform href="#leftWing" attributeName="transform" type="rotate" from="0 32 32" to="-10 32 32" dur="1s" repeatCount="indefinite" direction="alternate" />
  <animateTransform href="#rightWing" attributeName="transform" type="rotate" from="0 32 32" to="10 32 32" dur="1s" repeatCount="indefinite" direction="alternate" />
`);

// Generate AI Helper SVG
generateSVG('ai_helper.svg', 32, 48, `
  <!-- AI Helper Character -->
  <!-- Body -->
  <rect x="12" y="24" width="8" height="20" fill="#32CD32" />
  <!-- Head -->
  <circle cx="16" cy="16" r="8" fill="#90EE90" />
  <!-- Eyes -->
  <circle cx="13" cy="14" r="1.5" fill="#000000" />
  <circle cx="19" cy="14" r="1.5" fill="#000000" />
  <!-- Antennae -->
  <line x1="16" y1="8" x2="12" y2="4" stroke="#32CD32" stroke-width="2" />
  <line x1="16" y1="8" x2="20" y2="4" stroke="#32CD32" stroke-width="2" />
  <!-- Smile -->
  <path d="M13,18 Q16,21 19,18" stroke="#000000" stroke-width="1" fill="none" />
`);

// Terminal Sprite for Minigames
generateSVG('terminal_sprite.svg', 32, 48, `
  <!-- Terminal Sprite -->
  <rect x="4" y="8" width="24" height="32" fill="#000080" rx="4" ry="4" />
  <!-- Screen -->
  <rect x="8" y="12" width="16" height="20" fill="#00CED1" />
  <!-- Keyboard -->
  <rect x="8" y="34" width="16" height="4" fill="#333" />
`);

// AI Helper Sprite
generateSVG('ai_helper.svg', 32, 48, `
  <!-- AI Helper Character -->
  <!-- Body -->
  <rect x="12" y="24" width="8" height="20" fill="#32CD32" />
  <!-- Head -->
  <circle cx="16" cy="16" r="8" fill="#90EE90" />
  <!-- Eyes -->
  <circle cx="13" cy="14" r="1.5" fill="#000000" />
  <circle cx="19" cy="14" r="1.5" fill="#000000" />
  <!-- Antennae -->
  <line x1="16" y1="8" x2="12" y2="4" stroke="#32CD32" stroke-width="2" />
  <line x1="16" y1="8" x2="20" y2="4" stroke="#32CD32" stroke-width="2" />
  <!-- Smile -->
  <path d="M13,18 Q16,21 19,18" stroke="#000000" stroke-width="1" fill="none" />
`);

// Fish Enemy Sprite
generateSVG('fish_enemy.svg', 64, 32, `
  <!-- Fish Enemy -->
  <!-- Body -->
  <ellipse cx="32" cy="16" rx="28" ry="12" fill="#FF4500" />
  <!-- Tail -->
  <polygon points="4,16 0,8 0,24" fill="#FF4500" />
  <!-- Eye -->
  <circle cx="40" cy="12" r="4" fill="#FFFFFF" />
  <circle cx="40" cy="12" r="2" fill="#000000" />
  <!-- Fin -->
  <polygon points="20,8 28,16 20,24" fill="#FF6347" />
`);

// Sailboat Sprite
generateSVG('sailboat.svg', 128, 128, `
  <!-- Sailboat -->
  <!-- Hull -->
  <path d="M16,96 L112,96 L80,112 L48,112 Z" fill="#8B4513" stroke="#5C3317" stroke-width="2" />
  <!-- Mast -->
  <rect x="64" y="32" width="4" height="64" fill="#5C3317" />
  <!-- Sail -->
  <path d="M68,32 L68,96 L96,64 Z" fill="#FFFFFF" stroke="#CCCCCC" stroke-width="2" />
  <!-- Flag -->
  <path d="M66,32 L66,24 L80,28 L66,32 Z" fill="#FF0000" stroke="#CC0000" stroke-width="1" />
`);

// Terminal Sprite (if not already generated)
generateSVG('terminal_sprite.svg', 32, 48, `
  <!-- Terminal Sprite -->
  <rect x="4" y="8" width="24" height="32" fill="#000080" rx="4" ry="4" />
  <!-- Screen -->
  <rect x="8" y="12" width="16" height="20" fill="#00CED1" />
  <!-- Keyboard -->
  <rect x="8" y="34" width="16" height="4" fill="#333" />
`);

// For example, if 'dataPoint' sprite is needed for the minigame:
generateSVG('dataPoint.svg', 16, 16, `
  <!-- Data Point -->
  <circle cx="8" cy="8" r="8" fill="#FFD700" />
`);

generateSVG('noise_shield.svg', 64, 64, `
  <!-- Noise Shield Effect -->
  <defs>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" />
      <feDisplacementMap in="SourceGraphic" scale="10" />
    </filter>
  </defs>
  <circle cx="32" cy="32" r="30" fill="#00CED1" opacity="0.5" filter="url(#noise)" />
`);

// Generate Gaussian Wave SVG
generateSVG('gaussian_wave.svg', 800, 200, `
  <!-- Gaussian Wave -->
  <defs>
    <linearGradient id="gaussianGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00CED1; stop-opacity:0"/>
      <stop offset="50%" style="stop-color:#00CED1; stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#00CED1; stop-opacity:0"/>
    </linearGradient>
  </defs>
  <path d="M0,100 ${[...Array(801).keys()].map(x => {
  const y = 100 - 80 * Math.exp(-Math.pow((x - 400) / 100, 2));
  return `L${x},${y}`;
}).join(' ')}" fill="none" stroke="url(#gaussianGradient)" stroke-width="2"/>
`);

// Generate epsilon SVG
generateSVG('epsilon.svg', 32, 32, `
  <text x="16" y="24" font-size="24" text-anchor="middle" fill="#000">&#949;</text>
`);

// Generate delta SVG
generateSVG('delta.svg', 32, 32, `
  <text x="16" y="24" font-size="24" text-anchor="middle" fill="#000">&#948;</text>
`);

// Generate sigma SVG
generateSVG('sigma.svg', 32, 32, `
  <text x="16" y="24" font-size="24" text-anchor="middle" fill="#000">&#963;</text>
`);

// Generate HUD PET Slot SVG
generateSVG('hud_petSlot.svg', 40, 40, `
  <!-- PET Slot Background -->
  <rect x="0" y="0" width="40" height="40" fill="#333"
        stroke="#FFF" stroke-width="2" rx="5" ry="5" />
`);

generateSVG('ai_projectile.svg', 16, 16, `
  <!-- AI Helper Projectile -->
  <circle cx="8" cy="8" r="6" fill="#FFD700" stroke="#FFA500" stroke-width="2" />
  <!-- Glow Effect -->
  <circle cx="8" cy="8" r="8" fill="none" stroke="#FFFF00" stroke-width="1" opacity="0.5" />
`);

// Generate Federated Learning Boss SVG
generateSVG('fl_boss.svg', 64, 64, `
  <!-- Federated Learning Boss -->
  <!-- Outer Circle (Server) -->
  <circle cx="32" cy="32" r="30" fill="#00008B" stroke="#1E90FF" stroke-width="4" />
  <!-- Inner Gear -->
  <path d="M32,16 L36,24 L44,28 L36,32 L32,40 L28,32 L20,28 L28,24 Z" fill="#1E90FF" />
  <!-- Eye -->
  <circle cx="32" cy="32" r="6" fill="#FFFFFF" />
  <circle cx="32" cy="32" r="3" fill="#000000" />
`);

// Generate Federated Learning Minion SVG
generateSVG('fl_minion.svg', 32, 32, `
  <!-- Federated Learning Minion -->
  <!-- Body (Client Device) -->
  <rect x="6" y="6" width="20" height="20" fill="#228B22" rx="4" ry="4" stroke="#32CD32" stroke-width="2" />
  <!-- Screen -->
  <rect x="10" y="10" width="12" height="12" fill="#ADFF2F" />
  <!-- Antenna -->
  <line x1="16" y1="6" x2="16" y2="0" stroke="#32CD32" stroke-width="2" />
  <circle cx="16" cy="0" r="2" fill="#32CD32" />
`);

// Generate boss projectile SVG
generateSVG('boss_projectile.svg', 16, 16, `
  <!-- Boss Projectile -->
  <circle cx="8" cy="8" r="6" fill="#FF4500" stroke="#FFD700" stroke-width="2" />
  <!-- Glow Effect -->
  <circle cx="8" cy="8" r="8" fill="none" stroke="#FFA500" stroke-width="1" opacity="0.5" />
`);

// Generate laser charge frames
for (let i = 1; i <= 4; i++) {
  const opacity = i * 0.25; // Gradually increasing opacity
  generateSVG(`laser_charge_frame${i}.svg`, 64, 64, `
    <!-- Laser Charge Animation Frame ${i} -->
    <circle cx="32" cy="32" r="30" fill="none" stroke="#FF0000" stroke-width="4" opacity="${opacity}" />
    <circle cx="32" cy="32" r="${10 + i * 5}" fill="#FF0000" opacity="${opacity}" />
  `);
}

// Generate base Homomorphic Encryption Boss SVG
generateSVG('he_boss_phase1.svg', 96, 96, `
  <!-- Phase 1: Fully Encrypted Form -->
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#00FFFF;stop-opacity:0"/>
    </radialGradient>
  </defs>

  <!-- Outer Shield -->
  <path d="M48,8 L88,28 L88,68 L48,88 L8,68 L8,28 Z" 
        fill="#291D54" stroke="#FF10F0" stroke-width="2"/>
  
  <!-- Encrypted Core -->
  <circle cx="48" cy="48" r="24" fill="url(#coreGlow)"/>
  
  <!-- Defense Matrix -->
  <circle cx="48" cy="48" r="32" fill="none" stroke="#00FFFF" stroke-width="1" stroke-dasharray="4,4"/>
  <circle cx="48" cy="48" r="28" fill="none" stroke="#FF10F0" stroke-width="1" stroke-dasharray="4,4"/>
  
  <!-- Encryption Symbols -->
  <text x="48" y="45" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">E(x×y)</text>
  <text x="48" y="55" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">E(k+m)</text>
`);

// Generate damaged boss state
generateSVG('he_boss_phase2.svg', 96, 96, `
  <!-- Phase 2: Partially Decrypted -->
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#00FFFF;stop-opacity:0"/>
    </radialGradient>
  </defs>

  <!-- Cracked Shield -->
  <path d="M48,8 L88,28 L88,68 L48,88 L8,68 L8,28 Z" 
        fill="#291D54" stroke="#FF10F0" stroke-width="2" stroke-dasharray="10,5"/>
  
  <!-- Exposed Core -->
  <circle cx="48" cy="48" r="26" fill="url(#coreGlow)"/>
  
  <!-- Unstable Matrix -->
  <circle cx="48" cy="48" r="32" fill="none" stroke="#00FFFF" stroke-width="2" stroke-dasharray="15,15"/>
  
  <!-- Glitched Symbols -->
  <text x="48" y="45" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle" opacity="0.7">E(x)×E(y)</text>
  <text x="48" y="55" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle" opacity="0.7">E(k)</text>
`);

// Generate final boss state
generateSVG('he_boss_phase3.svg', 96, 96, `
  <!-- Phase 3: Encryption Breaking -->
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#00FFFF;stop-opacity:0"/>
    </radialGradient>
  </defs>

  <!-- Broken Shield -->
  <path d="M48,8 L88,28 L88,68 L48,88 L8,68 L8,28 Z" 
        fill="#291D54" stroke="#FF10F0" stroke-width="3" stroke-dasharray="5,15"/>
  
  <!-- Unstable Core -->
  <circle cx="48" cy="48" r="28" fill="url(#coreGlow)"/>
  
  <!-- Breaking Matrix -->
  <circle cx="48" cy="48" r="32" fill="none" stroke="#00FFFF" stroke-width="3" stroke-dasharray="2,8"/>
  
  <!-- Decrypted Symbols -->
  <text x="48" y="45" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">x × y</text>
  <text x="48" y="55" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">k + m</text>
`);

// Generate Boss Arena Background
generateSVG('he_boss_background.svg', 800, 600, `
  <!-- Encrypted Domain Background -->
  <defs>
    <pattern id="matrixPattern" width="100" height="100" patternUnits="userSpaceOnUse">
      <text x="10" y="20" font-family="monospace" fill="#00FFFF" opacity="0.1" font-size="10">E(x+y)</text>
      <text x="50" y="40" font-family="monospace" fill="#FF10F0" opacity="0.1" font-size="10">E(x×y)</text>
      <text x="30" y="60" font-family="monospace" fill="#FFFFFF" opacity="0.1" font-size="10">E(k)</text>
      <text x="70" y="80" font-family="monospace" fill="#00FFFF" opacity="0.1" font-size="10">E(m)</text>
    </pattern>
    <radialGradient id="arenaGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#120458;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#291D54;stop-opacity:1"/>
    </radialGradient>
  </defs>
  <!-- Background Elements -->
  <rect x="0" y="0" width="800" height="600" fill="url(#arenaGlow)"/>
  <rect x="0" y="0" width="800" height="600" fill="url(#matrixPattern)"/>
  <!-- Encrypted Domain Border -->
<rect x="0" y="0" width="800" height="600" 
     fill="none" stroke="#FF10F0" stroke-width="4" 
     stroke-dasharray="20,10,5,10"/>
`);

// Generate Encrypted Platform
generateSVG('he_platform.svg', 128, 32, `
  <!-- Homomorphic Platform -->
  <defs>
    <linearGradient id="platformGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:0.5"/>
      <stop offset="50%" style="stop-color:#00FFFF;stop-opacity:0.5"/>
      <stop offset="100%" style="stop-color:#FF10F0;stop-opacity:0.5"/>
    </linearGradient>
  </defs>
  <!-- Platform Base -->
  <rect x="0" y="0" width="128" height="32" fill="#291D54"/>
  <rect x="0" y="0" width="128" height="32" fill="url(#platformGlow)"/>
  <!-- Encryption Circuit Pattern -->
  <line x1="0" y1="16" x2="128" y2="16" stroke="#00FFFF" stroke-width="1" stroke-dasharray="8,4"/>
  <text x="64" y="20" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">E(platform)</text>
`);

// Generate Encrypted Projectile
generateSVG('encrypted_projectile.svg', 24, 24, `
  <!-- Encrypted Projectile -->
  <defs>
    <radialGradient id="projectileGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#00FFFF;stop-opacity:0"/>
    </radialGradient>
  </defs>
  <!-- Projectile Core -->
  <circle cx="12" cy="12" r="8" fill="url(#projectileGlow)"/>
  <!-- Encryption Field -->
  <circle cx="12" cy="12" r="10" fill="none" stroke="#FF10F0" stroke-width="1">
    <animateTransform attributeName="transform" type="rotate"
      from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
  </circle>
  <!-- Data Symbols -->
<text x="12" y="14" font-family="monospace" fill="#FFFFFF" font-size="6" text-anchor="middle">Ex</text>
`);

// Generate Homomorphic Minion - Now clearly a robotic enemy
generateSVG('he_minion.svg', 48, 48, `
  <!-- Data Collection Minion - Evil Robot Design -->
  <defs>
    <linearGradient id="minionGlow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:0.8"/>
      <stop offset="100%" style="stop-color:#00FFFF;stop-opacity:0.8"/>
    </linearGradient>
  </defs>
  
  <!-- Robot Head -->
  <path d="M18,12 L30,12 L32,16 L30,20 L18,20 L16,16 Z" 
        fill="#291D54" stroke="#FF10F0" stroke-width="1"/>
  
  <!-- Evil Glowing Eyes -->
  <circle cx="22" cy="16" r="2" fill="#FF0000">
    <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
  </circle>
  <circle cx="26" cy="16" r="2" fill="#FF0000">
    <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Robot Body -->
  <path d="M20,20 L28,20 L32,36 L16,36 Z" 
        fill="#291D54" stroke="#FF10F0" stroke-width="1"/>
  
  <!-- Antenna -->
  <line x1="24" y1="8" x2="24" y2="12" stroke="#FF10F0" stroke-width="2"/>
  <circle cx="24" cy="8" r="2" fill="#FF10F0"/>
  
  <!-- Arms -->
  <path d="M16,24 L12,28 L12,32 L14,34" stroke="#FF10F0" stroke-width="2" fill="none"/>
  <path d="M32,24 L36,28 L36,32 L34,34" stroke="#FF10F0" stroke-width="2" fill="none"/>
  
  <!-- Matrix Core -->
  <rect x="22" y="24" width="4" height="8" fill="#00FFFF" opacity="0.8"/>
  <text x="24" y="30" font-family="monospace" fill="#000" font-size="6" text-anchor="middle">01</text>
  
  <!-- Energy Field -->
  <circle cx="24" cy="24" r="16" fill="none" stroke="#FF10F0" stroke-width="1" stroke-dasharray="2,2">
    <animateTransform attributeName="transform" type="rotate"
      from="0 24 24" to="360 24 24" dur="6s" repeatCount="indefinite"/>
  </circle>
`);

// Generate Decryption Key - Now OBVIOUSLY a key!
generateSVG('decryption_key.svg', 48, 24, `
  <!-- Decryption Key - Classic Key Shape -->
  <defs>
    <linearGradient id="keyGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1"/>
      <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#FFD700;stop-opacity:1"/>
    </linearGradient>
  </defs>
  
  <!-- Key Bow (Head) - Large and ornate -->
  <path d="M4,12 A6,6 0 1,0 4,12.1 M4,8 L4,16" 
        stroke="url(#keyGlow)" stroke-width="3" fill="none"/>
  
  <!-- Key Shaft -->
  <line x1="10" y1="12" x2="40" y2="12" 
        stroke="url(#keyGlow)" stroke-width="3"/>
  
  <!-- Key Teeth - Distinctive notches -->
  <path d="M30,12 L32,8 L34,12 L36,8 L38,12" 
        stroke="url(#keyGlow)" stroke-width="3" fill="none"/>
  
  <!-- Sparkle Effect -->
  <circle cx="4" cy="12" r="3" fill="#FFFFFF">
    <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite"/>
  </circle>
  
  <!-- Binary Pattern -->
  <text x="20" y="10" font-family="monospace" fill="#FFFFFF" font-size="4">DECRYPT</text>
  
  <!-- Energy Pulse -->
  <circle cx="4" cy="12" r="8" fill="url(#keyGlow)" opacity="0.3">
    <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
  </circle>
`);

generateSVG('secret_portal.svg', 96, 96, `
  <!-- Homomorphic Portal -->
  <defs>
    <radialGradient id="portalGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FF10F0;stop-opacity:1"/>
      <stop offset="30%" style="stop-color:#00FFFF;stop-opacity:0.6"/>
      <stop offset="100%" style="stop-color:#291D54;stop-opacity:0"/>
    </radialGradient>
    <filter id="portalBlur">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
  </defs>

  <!-- Portal Background -->
  <circle cx="48" cy="48" r="44" fill="url(#portalGlow)" filter="url(#portalBlur)"/>
  
  <!-- Encryption Field -->
  <g>
    <circle cx="48" cy="48" r="40" fill="none" stroke="#FF10F0" stroke-width="2">
      <animateTransform attributeName="transform" type="rotate"
        from="0 48 48" to="360 48 48" dur="8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="48" cy="48" r="36" fill="none" stroke="#00FFFF" stroke-width="2">
      <animateTransform attributeName="transform" type="rotate"
        from="360 48 48" to="0 48 48" dur="6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="48" cy="48" r="32" fill="none" stroke="#FF10F0" stroke-width="1">
      <animateTransform attributeName="transform" type="rotate"
        from="0 48 48" to="360 48 48" dur="4s" repeatCount="indefinite"/>
    </circle>
  </g>
  
  <!-- Matrix Symbols -->
  <g font-family="monospace" fill="#FFFFFF" font-size="8">
    <text x="48" y="40" text-anchor="middle">E(x×y)</text>
    <text x="48" y="52" text-anchor="middle">E(k+m)</text>
    <text x="48" y="64" text-anchor="middle">HOMO</text>
  </g>
</svg>
`);

// Secure Multiparty Computation Boss

// Generate the 4 friendly receivers (representing compute nodes)
// Each has a unique color and shape to be easily distinguishable
generateSVG('smc_friendly1.svg', 64, 64, `
  <defs>
    <radialGradient id="nodeGlow1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#1B5E20;stop-opacity:1"/>
    </radialGradient>
  </defs>
  <!-- Base Node -->
  <circle cx="32" cy="32" r="24" fill="url(#nodeGlow1)" stroke="#81C784" stroke-width="2"/>
  <!-- Computation Indicators -->
  <path d="M24,32 L40,32 M32,24 L32,40" stroke="#FFFFFF" stroke-width="3"/>
  <!-- Binary Ring -->
  <circle cx="32" cy="32" r="28" fill="none" stroke="#A5D6A7" stroke-width="1" 
    stroke-dasharray="4,4">
    <animateTransform attributeName="transform" type="rotate"
      from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite"/>
  </circle>
  <text x="32" y="36" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">NODE 1</text>
`);

generateSVG('smc_friendly2.svg', 64, 64, `
  <defs>
    <radialGradient id="nodeGlow2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#2196F3;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#0D47A1;stop-opacity:1"/>
    </radialGradient>
  </defs>
  <!-- Base Node -->
  <rect x="8" y="8" width="48" height="48" rx="8" fill="url(#nodeGlow2)" stroke="#64B5F6" stroke-width="2"/>
  <!-- Computation Indicators -->
  <path d="M24,32 L40,32 M32,24 L32,40" stroke="#FFFFFF" stroke-width="3"/>
  <!-- Binary Ring -->
  <rect x="4" y="4" width="56" height="56" rx="10" fill="none" stroke="#90CAF9" stroke-width="1" 
    stroke-dasharray="4,4">
    <animateTransform attributeName="transform" type="rotate"
      from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite"/>
  </rect>
  <text x="32" y="36" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">NODE 2</text>
`);

generateSVG('smc_friendly3.svg', 64, 64, `
  <defs>
    <radialGradient id="nodeGlow3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#9C27B0;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#4A148C;stop-opacity:1"/>
    </radialGradient>
  </defs>
  <!-- Base Node -->
  <polygon points="32,8 56,32 32,56 8,32" fill="url(#nodeGlow3)" stroke="#BA68C8" stroke-width="2"/>
  <!-- Computation Indicators -->
  <path d="M24,32 L40,32 M32,24 L32,40" stroke="#FFFFFF" stroke-width="3"/>
  <!-- Binary Ring -->
  <polygon points="32,4 60,32 32,60 4,32" fill="none" stroke="#CE93D8" stroke-width="1" 
    stroke-dasharray="4,4">
    <animateTransform attributeName="transform" type="rotate"
      from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite"/>
  </polygon>
  <text x="32" y="36" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">NODE 3</text>
`);

generateSVG('smc_friendly4.svg', 64, 64, `
  <defs>
    <radialGradient id="nodeGlow4" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FF5722;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#BF360C;stop-opacity:1"/>
    </radialGradient>
  </defs>
  <!-- Base Node -->
  <path d="M32,8 L56,20 L56,44 L32,56 L8,44 L8,20 Z" fill="url(#nodeGlow4)" stroke="#FF8A65" stroke-width="2"/>
  <!-- Computation Indicators -->
  <path d="M24,32 L40,32 M32,24 L32,40" stroke="#FFFFFF" stroke-width="3"/>
  <!-- Binary Ring -->
  <path d="M32,4 L60,16 L60,48 L32,60 L4,48 L4,16 Z" fill="none" stroke="#FFAB91" stroke-width="1" 
    stroke-dasharray="4,4">
    <animateTransform attributeName="transform" type="rotate"
      from="0 32 32" to="360 32 32" dur="6s" repeatCount="indefinite"/>
  </path>
  <text x="32" y="36" font-family="monospace" fill="#FFFFFF" font-size="8" text-anchor="middle">NODE 4</text>
`);

// Generate the secure package that needs to be delivered
generateSVG('smc_package.svg', 32, 32, `
<!-- Package Base -->
<rect x="2" y="2" width="20" height="20" 
      fill="#FFD700" stroke="#FFA000" stroke-width="2" filter="url(#dropShadow)"/>

<!-- Lock Symbol -->
<circle cx="12" cy="12" r="4" fill="none" stroke="#FFA000" stroke-width="2"/>
<rect x="10" y="10" width="4" height="6" fill="#FFA000"/>

<!-- Attention-grabbing glow -->
<rect x="0" y="0" width="24" height="24" fill="none" 
      stroke="#FFE082" stroke-width="2" stroke-dasharray="4,4">
  <animateTransform attributeName="transform" type="rotate"
    from="0 12 12" to="360 12 12" dur="2s" repeatCount="indefinite"/>
</rect>

<!-- Bounce indicator -->
<path d="M2,22 L22,22" stroke="#FFE082" stroke-width="2" stroke-dasharray="2,2">
  <animate attributeName="d" 
    values="M2,22 L22,22;M2,20 C12,24 12,24 22,20;M2,22 L22,22" 
    dur="1s" repeatCount="indefinite"/>
</path>
`);

// Generate the SMC Boss
generateSVG('smc_boss.svg', 128, 128, `
  <defs>
    <radialGradient id="bossCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#FF1744;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#D50000;stop-opacity:1"/>
    </radialGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#FF1744"/>
    </filter>
  </defs>
  <!-- Evil Core -->
  <circle cx="64" cy="64" r="32" fill="url(#bossCore)" filter="url(#shadow)"/>
  <!-- Malicious Data Tendrils -->
  <g stroke="#FF1744" stroke-width="3" fill="none">
    <path d="M64,32 C32,32 32,96 64,96">
      <animate attributeName="d" 
        values="M64,32 C32,32 32,96 64,96;M64,32 C96,32 96,96 64,96;M64,32 C32,32 32,96 64,96" 
        dur="4s" repeatCount="indefinite"/>
    </path>
    <path d="M32,64 C32,32 96,32 96,64">
      <animate attributeName="d" 
        values="M32,64 C32,32 96,32 96,64;M32,64 C32,96 96,96 96,64;M32,64 C32,32 96,32 96,64" 
        dur="4s" repeatCount="indefinite"/>
    </path>
  </g>
  <!-- Corruption Aura -->
  <circle cx="64" cy="64" r="48" stroke="#FF1744" stroke-width="2" fill="none" stroke-dasharray="8,8">
    <animate attributeName="r" values="48;52;48" dur="2s" repeatCount="indefinite"/>
    <animateTransform attributeName="transform" type="rotate"
      from="0 64 64" to="360 64 64" dur="8s" repeatCount="indefinite"/>
  </circle>
  <!-- Evil Eyes -->
  <circle cx="56" cy="56" r="4" fill="#FFFFFF"/>
  <circle cx="72" cy="56" r="4" fill="#FFFFFF"/>
  <circle cx="56" cy="56" r="2" fill="#000000"/>
  <circle cx="72" cy="56" r="2" fill="#000000"/>
  <!-- Menacing Mouth -->
  <path d="M52,72 Q64,80 76,72" stroke="#FFFFFF" stroke-width="3" fill="none"/>
`);

// Generate the Boss Level Background
generateSVG('smc_boss_background.svg', 800, 600, `
  <defs>
    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M0,0 L50,0 L50,50 L0,50 Z" fill="none" stroke="#1A237E" stroke-width="0.5"/>
    </pattern>
    <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#000000;stop-opacity:0"/>
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0.7"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Dark Background -->
  <rect width="800" height="600" fill="#0D1117"/>
  <!-- Cyber Grid -->
  <rect width="800" height="600" fill="url(#grid)"/>
  <!-- Data Flow Lines -->
  <g stroke="#304FFE" stroke-width="1" opacity="0.3">
    ${Array.from({ length: 10 }, (_, i) => `
      <line x1="${i * 80}" y1="0" x2="${i * 80 + 400}" y2="600">
        <animate attributeName="y2" values="600;0;600" dur="${3 + i}s" repeatCount="indefinite"/>
      </line>
    `).join('')}
  </g>
  <!-- Binary Rain -->
  <g fill="#304FFE" font-family="monospace" font-size="10" opacity="0.2">
    ${Array.from({ length: 20 }, (_, i) => `
      <text x="${i * 40}" y="0">
        <animate attributeName="y" values="0;600;0" dur="${5 + i % 3}s" repeatCount="indefinite"/>
        01
      </text>
    `).join('')}
  </g>
  <!-- Vignette Effect -->
  <rect width="800" height="600" fill="url(#vignette)"/>
  <!-- Edge Glow -->
  <rect width="800" height="600" fill="none" stroke="#304FFE" stroke-width="4" filter="url(#glow)"/>
`);

generateSVG('boss_projectile.svg', 16, 16, `
  <circle cx="8" cy="8" r="8" fill="#8B0000"/>
  <text x="8" y="11" font-family="Arial" font-size="10" fill="#fff" text-anchor="middle">!</text>
`);

// Generate player idle with package sprite
generateSVG('player_with_package.svg', 32, 48, `
  <!-- Idle Stance with Package -->
  <!-- Base Character -->
  <!-- Trench Coat -->
  <rect x="12" y="24" width="8" height="20" fill="#D4C4A8" />
  <rect x="11" y="24" width="10" height="4" fill="#BEB19A" />
  
  <!-- Suit -->
  <rect x="13" y="20" width="6" height="8" fill="#2F2F2F" />
  
  <!-- Head -->
  <rect x="13" y="16" width="6" height="6" fill="#E6D5C1" />
  
  <!-- Sunglasses -->
  <rect x="13" y="18" width="6" height="2" fill="#000000" />
  
  <!-- Hair -->
  <rect x="13" y="16" width="6" height="2" fill="#4A3C31" />
  
  <!-- Arms Holding Package -->
  <rect x="10" y="24" width="3" height="6" fill="#D4C4A8" />
  <rect x="19" y="24" width="3" height="6" fill="#D4C4A8" />
  
  <!-- Package -->
  <rect x="11" y="26" width="10" height="8" fill="#FFD700" stroke="#FFA000" stroke-width="1" />
  <circle cx="16" cy="30" r="2" fill="none" stroke="#FFA000" stroke-width="1"/>
  <rect x="15" y="29" width="2" height="3" fill="#FFA000"/>
  
  <!-- Security Aura around Package -->
  <rect x="9" y="24" width="14" height="12" fill="none" 
        stroke="#FFE082" stroke-width="1" stroke-dasharray="2,2">
    <animateTransform attributeName="transform" type="rotate"
      from="0 16 30" to="360 16 30" dur="3s" repeatCount="indefinite"/>
  </rect>
  
  <!-- Shoes -->
  <rect x="12" y="44" width="4" height="2" fill="#000000" />
`);

// Generate player walk frame 1 with package
generateSVG('player_with_package_walk1.svg', 32, 48, `
  <!-- Walking Frame 1 with Package -->
  <!-- Base Character -->
  <!-- Trench Coat -->
  <rect x="12" y="24" width="8" height="18" fill="#D4C4A8" />
  <rect x="11" y="24" width="10" height="4" fill="#BEB19A" />
  
  <!-- Suit -->
  <rect x="13" y="20" width="6" height="8" fill="#2F2F2F" />
  
  <!-- Head -->
  <rect x="13" y="16" width="6" height="6" fill="#E6D5C1" />
  
  <!-- Sunglasses -->
  <rect x="13" y="18" width="6" height="2" fill="#000000" />
  
  <!-- Hair -->
  <rect x="13" y="16" width="6" height="2" fill="#4A3C31" />
  
  <!-- Arms Holding Package -->
  <rect x="10" y="24" width="3" height="6" fill="#D4C4A8" />
  <rect x="19" y="24" width="3" height="6" fill="#D4C4A8" />
  
  <!-- Package -->
  <rect x="11" y="26" width="10" height="8" fill="#FFD700" stroke="#FFA000" stroke-width="1" />
  <circle cx="16" cy="30" r="2" fill="none" stroke="#FFA000" stroke-width="1"/>
  <rect x="15" y="29" width="2" height="3" fill="#FFA000"/>
  
  <!-- Security Aura around Package -->
  <rect x="9" y="24" width="14" height="12" fill="none" 
        stroke="#FFE082" stroke-width="1" stroke-dasharray="2,2">
    <animateTransform attributeName="transform" type="rotate"
      from="0 16 30" to="360 16 30" dur="3s" repeatCount="indefinite"/>
  </rect>
  
  <!-- Walking Legs Frame 1 -->
  <rect x="12" y="42" width="3" height="4" fill="#2F2F2F" />
  <rect x="17" y="42" width="3" height="4" fill="#2F2F2F" />
`);

// Generate player walk frame 2 with package
generateSVG('player_with_package_walk2.svg', 32, 48, `
  <!-- Walking Frame 2 with Package -->
  <!-- Base Character -->
  <!-- Trench Coat -->
  <rect x="12" y="24" width="8" height="18" fill="#D4C4A8" />
  <rect x="11" y="24" width="10" height="4" fill="#BEB19A" />
  
  <!-- Suit -->
  <rect x="13" y="20" width="6" height="8" fill="#2F2F2F" />
  
  <!-- Head -->
  <rect x="13" y="16" width="6" height="6" fill="#E6D5C1" />
  
  <!-- Sunglasses -->
  <rect x="13" y="18" width="6" height="2" fill="#000000" />
  
  <!-- Hair -->
  <rect x="13" y="16" width="6" height="2" fill="#4A3C31" />
  
  <!-- Arms Holding Package -->
  <rect x="10" y="24" width="3" height="6" fill="#D4C4A8" />
  <rect x="19" y="24" width="3" height="6" fill="#D4C4A8" />
  
  <!-- Package -->
  <rect x="11" y="26" width="10" height="8" fill="#FFD700" stroke="#FFA000" stroke-width="1" />
  <circle cx="16" cy="30" r="2" fill="none" stroke="#FFA000" stroke-width="1"/>
  <rect x="15" y="29" width="2" height="3" fill="#FFA000"/>
  
  <!-- Security Aura around Package -->
  <rect x="9" y="24" width="14" height="12" fill="none" 
        stroke="#FFE082" stroke-width="1" stroke-dasharray="2,2">
    <animateTransform attributeName="transform" type="rotate"
      from="0 16 30" to="360 16 30" dur="3s" repeatCount="indefinite"/>
  </rect>
  
  <!-- Walking Legs Frame 2 -->
  <rect x="14" y="42" width="3" height="4" fill="#2F2F2F" />
  <rect x="15" y="42" width="3" height="4" fill="#2F2F2F" />
`);