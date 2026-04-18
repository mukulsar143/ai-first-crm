import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logInteraction } from '../store/slices/interactionSlice';
import { User, Target, Calendar, Clock, Users, FileText, Package, Smile, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../utils';

const InteractionForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        doctor_name: '',
        interaction_type: 'Meeting',
        date: '2026-04-17',
        time: '09:00 AM',
        attendees: '',
        topics: '',
        sentiment: 'Neutral',
        outcomes: '',
        followup: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(logInteraction({
            doctor_name: formData.doctor_name,
            interaction_type: formData.interaction_type,
            summary: formData.topics,
            outcome: formData.outcomes,
            sentiment: formData.sentiment,
            created_at: new Date().toISOString()
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECTION 1: Interaction Details */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400">
                    <User size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Interaction Details</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="form-label">HCP Name</label>
                        <div className="relative">
                            <input
                                placeholder="Type name to search..."
                                className="form-input"
                                value={formData.doctor_name}
                                onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="form-label">Interaction Type</label>
                        <select
                            className="form-select"
                            value={formData.interaction_type}
                            onChange={(e) => setFormData({ ...formData, interaction_type: e.target.value })}
                        >
                            <option>Meeting</option>
                            <option>Call</option>
                            <option>Email</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <label className="form-label flex items-center gap-1.5">
                            <Calendar size={12} className="text-gray-400" /> Date
                        </label>
                        <input
                            type="date"
                            className="form-input"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="form-label flex items-center gap-1.5">
                            <Clock size={12} className="text-gray-400" /> Time
                        </label>
                        <input
                            type="text"
                            placeholder="09:00 AM"
                            className="form-input"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="form-label flex items-center gap-1.5 text-gray-700">Attendees</label>
                        <input
                            placeholder="Add staff or colleagues..."
                            className="form-input"
                            value={formData.attendees}
                            onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 2: Topics */}
            <div className="space-y-2">
                <label className="form-label flex items-center gap-1.5">
                    <FileText size={12} className="text-gray-400" /> Topics Discussed
                </label>
                <textarea
                    rows="3"
                    className="form-textarea"
                    placeholder="Briefly describe what was discussed (e.g. Product X efficacy, Clinical Trial Y results...)"
                    value={formData.topics}
                    onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                />
            </div>

            {/* SECTION 3: Materials & Samples */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Package size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Materials Shared / Samples</span>
                    </div>
                    <button type="button" className="text-blue-600 text-[11px] font-bold hover:underline">+ Add Sample</button>
                </div>

                <div className="border border-dashed border-gray-200 rounded-lg p-5 text-center">
                    <p className="text-[12px] text-gray-400 italic">No materials or samples added yet. Use search below.</p>
                </div>
            </div>

            {/* SECTION 4: Sentiment */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-400">
                    <Smile size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-wider">Observed HCP Sentiment</span>
                </div>
                <div className="flex gap-3">
                    {['Positive', 'Neutral', 'Negative'].map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setFormData({ ...formData, sentiment: s })}
                            className={cn(
                                "pill-button",
                                formData.sentiment === s && "active"
                            )}
                        >
                            <div className={cn(
                                "dot",
                                s === 'Positive' ? "bg-green-500" : s === 'Neutral' ? "bg-gray-400" : "bg-red-500"
                            )} />
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* SECTION 5: Outcomes + Follow-up */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="form-label">Outcomes</label>
                    <textarea
                        rows="4"
                        className="form-textarea"
                        placeholder="Decisions reach or key consensus..."
                        value={formData.outcomes}
                        onChange={(e) => setFormData({ ...formData, outcomes: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="form-label">Follow-up Actions</label>
                    <textarea
                        rows="4"
                        className="form-textarea"
                        placeholder="Detailed next steps..."
                        value={formData.followup}
                        onChange={(e) => setFormData({ ...formData, followup: e.target.value })}
                    />
                </div>
            </div>

            {/* SECTION 6: AI Suggested Next Steps */}
            <div className="ai-box space-y-2">
                <div className="flex items-center gap-1.5 text-blue-600">
                    <CheckCircle2 size={13} />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest">AI Suggested Next Steps</span>
                </div>
                <ul className="space-y-1">
                    <li className="ai-bullet">Schedule follow-up meeting in 24-48 hours</li>
                    <li className="ai-bullet">Send digital brochure for Product X Formulation</li>
                    <li className="ai-bullet">Enroll Dr. HCP in the Q3 Advisory Panel</li>
                </ul>
            </div>

            {/* ACTION ROW */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-8">
                <button type="button" className="text-gray-500 text-sm font-semibold hover:text-gray-700">Discard</button>
                <button type="submit" className="btn-primary">
                    Log Interaction <ArrowRight size={16} />
                </button>
            </div>
        </form>
    );
};

export default InteractionForm;
