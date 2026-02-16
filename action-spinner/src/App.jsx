import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import './ActionSpinner.css';

export default function ActionSpinner() {
    const [actions, setActions] = useState([
        'Go for a walk',
        'Read a book',
        'Call a friend',
        'Cook something new',
        'Play a game',
        'Exercise'
    ]);
    const [newAction, setNewAction] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const animationRef = useRef(null);

    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
        '#F8B739', '#52B788', '#E57373', '#64B5F6'
    ];

    const addAction = () => {
        if (newAction.trim()) {
            setActions([...actions, newAction.trim()]);
            setNewAction('');
        }
    };

    const deleteAction = (index) => {
        if (actions.length > 2) {
            setActions(actions.filter((_, i) => i !== index));
        }
    };

    const spin = () => {
        if (isSpinning || actions.length === 0) return;

        setIsSpinning(true);
        setSelectedIndex(null);

        // Random selection
        const targetIndex = Math.floor(Math.random() * actions.length);

        // Calculate target rotation
        const degreesPerSegment = 360 / actions.length;
        const baseRotations = 5; // Number of full spins
        const targetDegree = targetIndex * degreesPerSegment;
        const totalRotation = (baseRotations * 360) + (360 - targetDegree) + (degreesPerSegment / 2);

        const startRotation = rotation % 360;
        const finalRotation = rotation + totalRotation;

        // Animate
        const duration = 4000; // 4 seconds
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-cubic)
            const eased = 1 - Math.pow(1 - progress, 3);

            const currentRotation = startRotation + (totalRotation * eased);
            setRotation(currentRotation);

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setIsSpinning(false);
                setSelectedIndex(targetIndex);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <h1 className="title">
                    🎯 Action Spinner
                </h1>

                {/* Spinner Container */}
                <div className="spinner-container">
                    <div className="wheel-wrapper">
                        {/* Spinning Wheel */}
                        <svg
                            width="400"
                            height="400"
                            viewBox="0 0 400 400"
                            className="wheel-svg"
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
                            }}
                        >
                            {actions.map((action, index) => {
                                const angle = (360 / actions.length) * index;
                                const nextAngle = (360 / actions.length) * (index + 1);
                                const midAngle = (angle + nextAngle) / 2;

                                // Create pie slice path
                                const startX = 200 + 190 * Math.cos((angle - 90) * Math.PI / 180);
                                const startY = 200 + 190 * Math.sin((angle - 90) * Math.PI / 180);
                                const endX = 200 + 190 * Math.cos((nextAngle - 90) * Math.PI / 180);
                                const endY = 200 + 190 * Math.sin((nextAngle - 90) * Math.PI / 180);

                                const largeArc = (nextAngle - angle) > 180 ? 1 : 0;

                                const path = `M 200 200 L ${startX} ${startY} A 190 190 0 ${largeArc} 1 ${endX} ${endY} Z`;

                                // Text position
                                const textRadius = 120;
                                const textX = 200 + textRadius * Math.cos((midAngle - 90) * Math.PI / 180);
                                const textY = 200 + textRadius * Math.sin((midAngle - 90) * Math.PI / 180);

                                return (
                                    <g key={index}>
                                        <path
                                            d={path}
                                            fill={colors[index % colors.length]}
                                            stroke="white"
                                            strokeWidth="3"
                                        />
                                        <text
                                            x={textX}
                                            y={textY}
                                            fill="white"
                                            fontSize="14"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {action.length > 15 ? action.substring(0, 13) + '...' : action}
                                        </text>
                                    </g>
                                );
                            })}
                            {/* Center circle */}
                            <circle cx="200" cy="200" r="40" fill="white" stroke="#333" strokeWidth="3" />
                        </svg>

                        {/* Stationary Frog in Center */}
                        <div className="frog-center">
                            🐸
                        </div>

                        {/* Stationary Pointer at Top */}
                        <div className="pointer-top">
                            <div className="pointer-arrow"></div>
                        </div>
                    </div>
                </div>

                {/* Result Display */}
                {selectedIndex !== null && (
                    <div className="result-display">
                        <h2 className="result-title">Selected Action:</h2>
                        <p className="result-action" style={{ color: colors[selectedIndex % colors.length] }}>
                            {actions[selectedIndex]}
                        </p>
                    </div>
                )}

                {/* Spin Button */}
                <div className="spin-button-container">
                    <button
                        onClick={spin}
                        disabled={isSpinning || actions.length === 0}
                        className="spin-button"
                    >
                        {isSpinning ? '🌀 Spinning...' : '🎲 SPIN!'}
                    </button>
                </div>

                {/* Action Management */}
                <div className="action-management">
                    <h3 className="management-title">Manage Actions</h3>

                    {/* Add Action */}
                    <div className="add-action-container">
                        <input
                            type="text"
                            value={newAction}
                            onChange={(e) => setNewAction(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addAction()}
                            placeholder="Add new action..."
                            className="action-input"
                        />
                        <button onClick={addAction} className="add-button">
                            <Plus size={20} />
                            Add
                        </button>
                    </div>

                    {/* Action List */}
                    <div className="action-list">
                        {actions.map((action, index) => (
                            <div
                                key={index}
                                className="action-item"
                                style={{ backgroundColor: colors[index % colors.length] + '20' }}
                            >
                                <span className="action-text">{action}</span>
                                <button
                                    onClick={() => deleteAction(index)}
                                    disabled={actions.length <= 2}
                                    className="delete-button"
                                    title={actions.length <= 2 ? "Need at least 2 actions" : "Delete action"}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {actions.length <= 2 && (
                        <p className="info-text">
                            ℹ️ You need at least 2 actions to use the spinner
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}