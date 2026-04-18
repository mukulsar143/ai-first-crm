import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interactionService } from '../../services/api';

export const fetchInteractions = createAsyncThunk(
    'interactions/fetchInteractions',
    async () => {
        const response = await interactionService.getInteractions();
        return response.data.data;
    }
);

export const logInteraction = createAsyncThunk(
    'interactions/logInteraction',
    async (interactionData) => {
        const response = await interactionService.logInteraction(interactionData);
        return response.data.data;
    }
);

export const updateInteraction = createAsyncThunk(
    'interactions/updateInteraction',
    async ({ id, data }) => {
        const response = await interactionService.updateInteraction(id, data);
        return response.data.data;
    }
);

const interactionSlice = createSlice({
    name: 'interactions',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInteractions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInteractions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchInteractions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(logInteraction.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(updateInteraction.fulfilled, (state, action) => {
                const index = state.list.findIndex((i) => i.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            });
    },
});

export default interactionSlice.reducer;
