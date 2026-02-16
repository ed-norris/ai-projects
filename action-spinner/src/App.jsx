import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';

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
    const [frogRotation, setFrogRotation] = useState(0);
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

        // Calculate target rotation for frog
        const degreesPerSegment = 360 / actions.length;
        const baseRotations = 5; // Number of full spins
        const targetDegree = targetIndex * degreesPerSegment;
        const totalRotation = (baseRotations * 360) + targetDegree;

        const startRotation = frogRotation % 360;
        const finalRotation = frogRotation + totalRotation;

        // Animate
        const duration = 4000; // 4 seconds
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-cubic)
            const eased = 1 - Math.pow(1 - progress, 3);

            const currentRotation = startRotation + (totalRotation * eased);
            setFrogRotation(currentRotation);

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
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
                    🎯 Action Spinner
                </h1>

                {/* Spinner Container */}
                <div className="relative flex justify-center items-center mb-12">
                    <div className="relative w-[400px] h-[400px]">
                        {/* Stationary Wheel */}
                        <svg
                            width="400"
                            height="400"
                            viewBox="0 0 400 400"
                            className="absolute top-0 left-0"
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
                            <circle cx="200" cy="200" r="30" fill="white" stroke="#333" strokeWidth="3" />
                        </svg>

                        {/* Spinning Frog in Center */}
                        <div
                            className="absolute top-1/2 left-1/2 pointer-events-none"
                            style={{
                                transform: `translate(-50%, -50%) rotate(${frogRotation}deg)`,
                                transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
                            }}
                        >
                            <div
                                className="text-6xl"
                                style={{
                                    transform: 'translateY(-120px)',
                                }}
                            >
                                🐸
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result Display */}
                {selectedIndex !== null && (
                    <div className="bg-white rounded-lg p-6 mb-8 shadow-2xl text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Selected Action:</h2>
                        <p className="text-3xl font-bold" style={{ color: colors[selectedIndex % colors.length] }}>
                            {actions[selectedIndex]}
                        </p>
                    </div>
                )}

                {/* Spin Button */}
                <div className="text-center mb-8">
                    <button
                        onClick={spin}
                        disabled={isSpinning || actions.length === 0}
                        className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isSpinning ? '🌀 Spinning...' : '🎲 SPIN!'}
                    </button>
                </div>

                {/* Action Management */}
                <div className="bg-white rounded-lg p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Actions</h3>

                    {/* Add Action */}
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newAction}
                            onChange={(e) => setNewAction(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addAction()}
                            placeholder="Add new action..."
                            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                        <button
                            onClick={addAction}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={20} />
                            Add
                        </button>
                    </div>

                    {/* Action List */}
                    <div className="space-y-2">
                        {actions.map((action, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg"
                                style={{ backgroundColor: colors[index % colors.length] + '20' }}
                            >
                                <span className="font-medium text-gray-800 flex-1 min-w-0">{action}</span>
                                <button
                                    onClick={() => deleteAction(index)}
                                    disabled={actions.length <= 2}
                                    className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                    title={actions.length <= 2 ? "Need at least 2 actions" : "Delete action"}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {actions.length <= 2 && (
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            ℹ️ You need at least 2 actions to use the spinner
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}