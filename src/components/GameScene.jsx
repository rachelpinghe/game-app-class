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
    let player, npc, king, item, redGem, cursors;

    // Load images and assets before the game starts
    function preload() {
      this.load.image('bg', 'assets/image/bg.png');        // Background image
      this.load.spritesheet('player', 'assets/image/player.png', {
        frameWidth:48,
        frameHeight:48,
      });
      this.load.spritesheet('npc', 'assets/image/dogNPC.gif', {
        frameWidth:250,
        frameHeight:300,
      });       // NPC sprite
      this.load.spritesheet('king', 'assets/image/king.png', {
        frameWidth:250,
        frameHeight:300,
      });       // NPC sprite
      this.load.spritesheet('redGem', 'assets/image/gems.png',{
        frameWidth:172,
        frameHeight:172,
      });  // Item sprite

      this.load.spritesheet('item', 'assets/image/crystal.gif',{
        frameWidth:172,
        frameHeight:172,
      });  // Item sprite

    }

    // Create game objects and logic
    function create() {
      // Add and scale background to fill the screen
      this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'bg')
        .setDisplaySize(window.innerWidth, window.innerHeight);

      // Add the player sprite and resize it
      player = this.physics.add.sprite(100, 100, 'player')
        .setDisplaySize(64, 64)
        .setCollideWorldBounds(true);

      // Add an NPC sprite
      npc = this.physics.add.sprite(600, 200, 'npc').setDisplaySize(100, 100);
      // Add an NPC sprite
      king = this.physics.add.sprite(300, 500, 'king').setDisplaySize(100, 100);

      // Add an item that can be picked up
      item = this.physics.add.sprite(600, 600, 'item').setDisplaySize(100, 100);

      redGem = this.physics.add.sprite(1000, 200, 'redGem').setScale(0.5);

      this.anims.create({
        key: "walk_down",
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
        frameRate: 6,
        repeat: -1,
      })

      this.anims.create({
        key: "walk_left",
        frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
        frameRate: 6,
        repeat: -1,
      })

      this.anims.create({
        key: "walk_up",
        frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
        frameRate: 6,
        repeat: -1,
      })

      this.anims.create({
        key: "walk_right",
        frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
        frameRate: 6,
        repeat: -1,
      })

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

      this.anims.create({
        key: 'red_spin',
        frames: this.anims.generateFrameNumbers('redGem', { start: 0, end: 5 }),
        frameRate: 4,
        repeat: -1,
      })

      npc.anims.play('npc_idle', true);
      king.anims.play('king_idle', true);
      item.anims.play('item_spin', true);
      redGem.anims.play('red_spin', true);

      // Set up arrow key input
      cursors = this.input.keyboard.createCursorKeys();

      // Listen for SPACE key press
      this.input.keyboard.on('keydown-SPACE', () => {
        // Check if player is near the NPC
        const nearNpc = Phaser.Math.Distance.Between(player.x, player.y, npc.x, npc.y) < 100;

        const nearKing = Phaser.Math.Distance.Between(player.x, player.y, king.x, king.y) < 50;

        // Check if player is near the item
        const nearItem = Phaser.Math.Distance.Between(player.x, player.y, item.x, item.y) < 100;

        const nearRedGem = Phaser.Math.Distance.Between(player.x, player.y, redGem.x, redGem.y) < 50;

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
        else if (nearItem) {
          redGem.destroy();
          alert('You picked up the red gem!');
          setInventory(preve => [...preve, 'Red Gem']); // Add item to inventory
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
      if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('walk_left', true);
      }
      else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('walk_right', true);
      }
      else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('walk_up', true);
      }
      else if (cursors.down.isDown) {
        player.setVelocityY(160);
        player.anims.play('walk_down', true);
      }
      else {
        player.anims.stop(); // Stop animation if no movement
      }
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
