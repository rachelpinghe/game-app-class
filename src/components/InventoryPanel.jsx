import React from 'react';

export default function InventoryPanel({ inventory }) {
    return (
        <div style={{
            position:'absolute',
            top: '20px',
            right: '20px',
            background:'rgba(255, 255, 255, 0.9)',
            padding: '20px 30px',
            borderRadius: '8px',
            fontSize: '16px',
            zIndex:10,
        }}>
            <strong> Inventory: </strong>
            <ul style={{
                paddingLeft: '20px',
                color:'red',
                fontWeight:'bold',
            }}>
                {inventory.map((item, index)=>(
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}