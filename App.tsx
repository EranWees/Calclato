
import React, { useState } from 'react';

type Operator = '+' | '-' | '*' | '/';

// To avoid re-creating the button component on every render, define it outside the App component.
interface CalculatorButtonProps {
    onClick: (label: string) => void;
    label: string;
    className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ onClick, label, className = '' }) => {
    return (
        <button
            onClick={() => onClick(label)}
            className={`text-3xl sm:text-4xl font-semibold rounded-full aspect-square flex items-center justify-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-orange-400 ${className}`}
        >
            {label}
        </button>
    );
};


const App: React.FC = () => {
    const [displayValue, setDisplayValue] = useState<string>('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<Operator | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState<boolean>(false);

    const inputDigit = (digit: string) => {
        if (waitingForSecondOperand) {
            setDisplayValue(digit);
            setWaitingForSecondOperand(false);
        } else {
            setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForSecondOperand) {
            setDisplayValue('0.');
            setWaitingForSecondOperand(false);
            return;
        }
        if (!displayValue.includes('.')) {
            setDisplayValue(displayValue + '.');
        }
    };

    const clearInput = () => {
        setDisplayValue('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    };

    const toggleSign = () => {
        setDisplayValue(
            displayValue.startsWith('-')
                ? displayValue.substring(1)
                : `-${displayValue}`
        );
    };

    const inputPercent = () => {
        const currentValue = parseFloat(displayValue);
        setDisplayValue(String(currentValue / 100));
    };

    const performOperation = (nextOperator: Operator) => {
        const inputValue = parseFloat(displayValue);

        if (firstOperand === null) {
            setFirstOperand(inputValue);
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            setDisplayValue(String(result));
            setFirstOperand(result);
        }

        setWaitingForSecondOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (
        first: number,
        second: number,
        op: Operator
    ): number => {
        switch (op) {
            case '+':
                return first + second;
            case '-':
                return first - second;
            case '*':
                return first * second;
            case '/':
                return first / second;
            default:
                return second;
        }
    };

    const handleEquals = () => {
        const inputValue = parseFloat(displayValue);
        if (operator && firstOperand !== null) {
            const result = calculate(firstOperand, inputValue, operator);
            setDisplayValue(String(result));
            setFirstOperand(null);
            setOperator(null);
            setWaitingForSecondOperand(false);
        }
    };
    
    const handleButtonClick = (label: string) => {
        if (!isNaN(Number(label))) {
            inputDigit(label);
        } else {
            switch (label) {
                case '.':
                    inputDecimal();
                    break;
                case 'AC':
                    clearInput();
                    break;
                case '+/-':
                    toggleSign();
                    break;
                case '%':
                    inputPercent();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                    performOperation(label as Operator);
                    break;
                case '=':
                    handleEquals();
                    break;
            }
        }
    };
    
    const buttonLayout = [
        { label: 'AC', className: 'bg-gray-400 text-black hover:bg-gray-300' },
        { label: '+/-', className: 'bg-gray-400 text-black hover:bg-gray-300' },
        { label: '%', className: 'bg-gray-400 text-black hover:bg-gray-300' },
        { label: '/', className: 'bg-orange-500 text-white hover:bg-orange-400' },
        { label: '7', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '8', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '9', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '*', className: 'bg-orange-500 text-white hover:bg-orange-400' },
        { label: '4', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '5', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '6', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '-', className: 'bg-orange-500 text-white hover:bg-orange-400' },
        { label: '1', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '2', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '3', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '+', className: 'bg-orange-500 text-white hover:bg-orange-400' },
        { label: '0', className: 'bg-gray-700 text-white hover:bg-gray-600 col-span-2' },
        { label: '.', className: 'bg-gray-700 text-white hover:bg-gray-600' },
        { label: '=', className: 'bg-orange-500 text-white hover:bg-orange-400' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="w-full max-w-xs sm:max-w-sm p-4 space-y-4">
                <div className="text-white text-7xl sm:text-8xl font-light text-right break-all">
                    {displayValue}
                </div>
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                    {buttonLayout.map(btn => (
                        <CalculatorButton 
                            key={btn.label}
                            onClick={handleButtonClick}
                            label={btn.label}
                            className={btn.className}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;
