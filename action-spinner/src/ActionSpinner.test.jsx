import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionSpinner from './App';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

describe('ActionSpinner', () => {
    beforeEach(() => {
        // Mock animation frame to prevent infinite loops
        let frameId = 0;
        global.requestAnimationFrame = vi.fn(() => ++frameId);
        global.cancelAnimationFrame = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the title', () => {
        render(<ActionSpinner />);
        expect(screen.getByText(/Action Spinner/i)).toBeInTheDocument();
    });

    it('renders initial actions', () => {
        render(<ActionSpinner />);
        const actionList = screen.getAllByText('Go for a walk');
        const bookList = screen.getAllByText('Read a book');
        const friendList = screen.getAllByText('Call a friend');

        // Should appear in both wheel and action list
        expect(actionList.length).toBeGreaterThan(0);
        expect(bookList.length).toBeGreaterThan(0);
        expect(friendList.length).toBeGreaterThan(0);
    });

    it('renders the spin button', () => {
        render(<ActionSpinner />);
        expect(screen.getByRole('button', { name: /SPIN!/i })).toBeInTheDocument();
    });

    it('adds a new action when typing and clicking add', async () => {
        const user = userEvent.setup();
        render(<ActionSpinner />);

        const input = screen.getByPlaceholderText('Add new action...');
        const addButton = screen.getByRole('button', { name: /Add/i });

        await user.type(input, 'New action');
        await user.click(addButton);

        expect(screen.getAllByText('New action').length).toBeGreaterThan(0);
        expect(input).toHaveValue('');
    });

    it('adds a new action when pressing Enter', async () => {
        const user = userEvent.setup();
        render(<ActionSpinner />);

        const input = screen.getByPlaceholderText('Add new action...');

        await user.type(input, 'Another action{Enter}');

        expect(screen.getAllByText('Another action').length).toBeGreaterThan(0);
        expect(input).toHaveValue('');
    });

    it('does not add empty actions', async () => {
        const user = userEvent.setup();
        render(<ActionSpinner />);

        const input = screen.getByPlaceholderText('Add new action...');
        const addButton = screen.getByRole('button', { name: /Add/i });
        const initialActions = screen.getAllByRole('button').filter(btn =>
            btn.getAttribute('title')?.includes('Delete')
        );

        await user.type(input, '   ');
        await user.click(addButton);

        const finalActions = screen.getAllByRole('button').filter(btn =>
            btn.getAttribute('title')?.includes('Delete')
        );
        expect(finalActions).toHaveLength(initialActions.length);
    });

    it('deletes an action', async () => {
        const user = userEvent.setup();
        render(<ActionSpinner />);

        expect(screen.getAllByText('Go for a walk').length).toBeGreaterThan(0);

        const deleteButtons = screen.getAllByTitle('Delete action');
        await user.click(deleteButtons[0]);

        expect(screen.queryByText('Go for a walk')).not.toBeInTheDocument();
    });

    it('prevents deleting when only 2 actions remain', async () => {
        const user = userEvent.setup();
        render(<ActionSpinner />);

        // Get initial delete buttons
        let deleteButtons = screen.getAllByTitle('Delete action');

        // Delete actions until only 2 remain
        for (let i = 0; i < 4; i++) {
            deleteButtons = screen.queryAllByTitle('Delete action');
            if (deleteButtons.length > 0) {
                await user.click(deleteButtons[0]);
            }
        }

        // Now we should have 2 actions and delete buttons should be disabled
        const remainingDeleteButtons = screen.getAllByTitle('Need at least 2 actions');
        expect(remainingDeleteButtons).toHaveLength(2);
        remainingDeleteButtons.forEach(btn => {
            expect(btn).toBeDisabled();
        });
    });

    it('displays warning message when only 2 actions remain', async () => {
        const user = userEvent.setup();
        render(<ActionSpinner />);

        // Delete until only 2 remain
        let deleteButtons = screen.getAllByTitle('Delete action');
        for (let i = 0; i < 4; i++) {
            deleteButtons = screen.queryAllByTitle('Delete action');
            if (deleteButtons.length > 0) {
                await user.click(deleteButtons[0]);
            }
        }

        expect(screen.getByText(/You need at least 2 actions to use the spinner/i)).toBeInTheDocument();
    });

    it('spin button exists and is enabled initially', () => {
        render(<ActionSpinner />);
        const spinButton = screen.getByRole('button', { name: /SPIN!/i });
        expect(spinButton).toBeInTheDocument();
        expect(spinButton).not.toBeDisabled();
    });

    it('renders the frog emoji', () => {
        render(<ActionSpinner />);
        expect(screen.getByText('🐸')).toBeInTheDocument();
    });

    it('trims whitespace from new actions', async () => {
        const user = userEvent.setup();
        render(<ActionSpinner />);

        const input = screen.getByPlaceholderText('Add new action...');
        await user.type(input, '  Trimmed action  {Enter}');

        expect(screen.getAllByText('Trimmed action').length).toBeGreaterThan(0);
    });

    it('has 6 initial actions', () => {
        render(<ActionSpinner />);
        const deleteButtons = screen.getAllByTitle('Delete action');
        expect(deleteButtons).toHaveLength(6);
    });
});