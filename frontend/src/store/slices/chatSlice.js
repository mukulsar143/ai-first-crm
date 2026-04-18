import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interactionService } from '../../services/api';

export const sendChatMessage = createAsyncThunk(
    'chat/sendMessage',
    async (message, { rejectWithValue }) => {
        try {
            const response = await interactionService.aiChat(message);
            const apiResponse = response.data;

            if (!apiResponse.success) {
                return rejectWithValue(apiResponse.message || 'AI Assistant encountered an error.');
            }

            const result = apiResponse.data;
            if (!result) {
                return rejectWithValue('Received empty response from AI Assistant.');
            }

            return {
                user: message,
                ai: result.response,
                success: result.success
            };
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to connect to AI Assistant.';
            return rejectWithValue(message);
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        loading: false,
        error: null,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendChatMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendChatMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push({ role: 'user', content: action.payload.user });
                state.messages.push({ role: 'ai', content: action.payload.ai });
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
