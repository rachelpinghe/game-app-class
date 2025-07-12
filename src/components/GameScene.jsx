// Import React hooks and Phaser game engine
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import InventoryPanel from './InventoryPanel';
// Export the GameScene component
export default function GameScene() {
  // Create a ref to attach Phaser's canvas to a DOM node
  const gameRef = useRef(null);

  // React state to show/hide the conversation overlay
  const [showConversation, setShowConversation] = useState(false);
  const [showConv, setShowConv] = useState(false);
  const [inventory, setInventory] = useState([]); // State to manage inventory items

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Phaser game configuration object
    const config = {
      type: Phaser.AUTO, // Choose WebGL or Canvas rendering
      width: window.innerWidth, // Full screen width
      height: window.innerHeight, // Full screen height
      parent: gameRef.current, // Attach Phaser to this ref
      physics: {
        default: 'arcade', // Use Arcade physics (basic 2D)
        arcade: { debug: false }, // Turn off physics debug grid
      },
      scene: {
        preload, // Function to load assets
        create,  // Function to set up the game
        update,  // Function that runs every frame
      },
    };

    // Create a new Phaser game instance
    const game = new Phaser.Game(config);

    // Declare game variables
    let player, npc, king, item, cursors;

    // Load images and assets before the game starts
    function preload() {
      this.load.image('bg', 'assets/image/bg.png');        // Background image
      this.load.image('player', 'assets/image/player.gif'); // Player sprite
      this.load.spritesheet('npc', 'assets/image/dogNPC.gif', {
        frameWidth:250,
        frameHeight:300,
      });       // NPC sprite
      this.load.spritesheet('king', 'assets/image/king.png', {
        frameWidth:250,
        frameHeight:300,
      });       // NPC sprite
      this.load.spritesheet('item', 'assets/image/crystal.gif',{
        frameWidth:100,
        frameHeight:300,
      });  // Item sprite
    }

    // Create game objects and logic
    function create() {
      // Add and scale background to fill the screen
      this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'bg')
        .setDisplaySize(window.innerWidth, window.innerHeight);

      // Add the player sprite and resize it
      player = this.physics.add.sprite(100, 100, 'player').setDisplaySize(100, 100);

      // Add an NPC sprite
      npc = this.physics.add.sprite(600, 200, 'npc').setDisplaySize(100, 100);
      // Add an NPC sprite
      king = this.physics.add.sprite(300, 500, 'king').setDisplaySize(100, 100);

      // Add an item that can be picked up
      item = this.physics.add.sprite(600, 600, 'item').setDisplaySize(100, 100);

      this.anims.create({
        key: 'npc_idle',
        frames: this.anims.generateFrameNumbers('npc', { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1,
      })

      this.anims.create({
        key: 'king_idle',
        frames: this.anims.generateFrameNumbers('king', { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1,
      })

      this.anims.create({
        key: 'item_spin',
        frames: this.anims.generateFrameNumbers('item', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1,
      })

      npc.anims.play('npc_idle', true);
      king.anims.play('king_idle', true);
      item.anims.play('item_spin', true);

      // Set up arrow key input
      cursors = this.input.keyboard.createCursorKeys();

      // Listen for SPACE key press
      this.input.keyboard.on('keydown-SPACE', () => {
        // Check if player is near the NPC
        const nearNpc = Phaser.Math.Distance.Between(player.x, player.y, npc.x, npc.y) < 100;

        const nearKing = Phaser.Math.Distance.Between(player.x, player.y, king.x, king.y) < 50;

        // Check if player is near the item
        const nearItem = Phaser.Math.Distance.Between(player.x, player.y, item.x, item.y) < 100;

        // If near NPC, show conversation for 3 seconds
        if (nearNpc) {
          setShowConversation(true);
          setTimeout(() => setShowConversation(false), 3000);
        }
        // If near item, pick it up (destroy it) and show alert
        else if (nearItem) {
          item.destroy();
          alert('You picked up the item!');
          setInventory(preve => [...preve, 'Crystal']); // Add item to inventory
        }
        else if (nearKing) {
          setShowConv(true);
          setTimeout(() => setShowConv(false), 3000);
        }
      });
    }

    // Update runs every frame (~60 fps)
    function update() {
      player.setVelocity(0); // Stop player if no key pressed

      // Move player based on arrow key input
      if (cursors.left.isDown) player.setVelocityX(-160);
      if (cursors.right.isDown) player.setVelocityX(160);
      if (cursors.up.isDown) player.setVelocityY(-160);
      if (cursors.down.isDown) player.setVelocityY(160);
    }

    // Cleanup Phaser game instance on component unmount
    return () => {
      game.destroy(true);
    };
  }, []);

  // Return JSX: a div container that holds the Phaser canvas + dialog overlay
  return (
    <div className="game-wrapper" style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* This is where Phaser will inject the game canvas */}
      <div ref={gameRef} className="game-container" />

      {/* React-based conversation dialog box overlay */}
      {showConversation && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          borderRadius: '10px',
          fontSize: '18px',
          zIndex: 10
        }}>
           "Hi there! Welcome to our world."
        </div>
      )}
      {showConv && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '20px',
          background: 'rgba(252, 248, 248, 0.8)',
          color: 'black',
          borderRadius: '10px',
          fontSize: '18px',
          zIndex: 10
        }}>
           "Find me a crystal and I will reward you as the new king!"
        </div>
      )}
      <InventoryPanel inventory={inventory} />

    </div>
  );
}
