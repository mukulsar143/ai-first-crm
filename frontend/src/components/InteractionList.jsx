import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInteractions } from '../store/slices/interactionSlice';
import { FileText, Target, Smile, Calendar, ExternalLink } from 'lucide-react';
import { cn } from '../utils';

const InteractionList = () => {
    const dispatch = useDispatch();
    const { list: interactions, loading } = useSelector((state) => state.interactions);

    useEffect(() => {
        dispatch(fetchInteractions());
    }, [dispatch]);

    return (
        <div className="crm-card bg-white overflow-hidden border-gray-100">
            {/* List Header */}
            <div className="bg-gray-50/30 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    <h3 className="text-sm font-bold text-gray-800">Interaction History</h3>
                </div>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {interactions.length} Logs
                </span>
            </div>

            {/* List Content */}
            <div className="divide-y divide-gray-50">
                {interactions.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <div className="bg-gray-50 p-4 rounded-full">
                            <FileText size={24} className="text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-[13px] font-medium">No interactions logged yet.</p>
                    </div>
                ) : (
                    interactions.map((item) => (
                        <div key={item.id} className="p-6 hover:bg-gray-50/30 transition-colors group">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1 pr-8">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h4 className="text-[15px] font-bold text-gray-900 leading-none">{item.doctor_name}</h4>
                                        <div className="flex gap-2">
                                            <span className="inline-flex items-center gap-1 h-5 px-2 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                                                <Target size={11} /> {item.interaction_type}
                                            </span>
                                            <span className={cn(
                                                "inline-flex items-center gap-1 h-5 px-2 rounded text-[10px] font-bold uppercase tracking-wider border",
                                                item.sentiment === 'Positive' ? "bg-green-50 text-green-700 border-green-100" :
                                                    item.sentiment === 'Negative' ? "bg-red-50 text-red-700 border-red-100" :
                                                        "bg-gray-50 text-gray-700 border-gray-100"
                                            )}>
                                                <Smile size={11} /> {item.sentiment}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={13} />
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="text-[14px] text-gray-600 leading-relaxed max-w-4xl">
                                        {item.summary || "No description provided."}
                                    </p>

                                    {item.outcome && (
                                        <div className="flex items-start gap-2 bg-gray-50/80 rounded-lg p-3 border border-gray-100/50">
                                            <p className="text-gray-700 text-[13px] leading-relaxed">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Outcome:</span>
                                                {item.outcome}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <button className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default InteractionList;
