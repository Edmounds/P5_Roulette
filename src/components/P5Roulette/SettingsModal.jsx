import React from 'react';

const SettingsModal = ({ show, inputText, onChange, onCancel, onSave }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm animate-fade-in">
      <div className="relative w-[600px] bg-white border-4 border-[#E60012] p-8 transform -rotate-1 shadow-[10px_10px_0px_#000]">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-black transform rotate-45"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-black transform rotate-45"></div>

        <h2 className="text-4xl font-black text-black mb-6 border-b-4 border-black inline-block transform -skew-x-12">
          目标清单
        </h2>

        <textarea
          value={inputText}
          onChange={onChange}
          className="w-full h-64 bg-[#f0f0f0] text-black font-bold text-xl p-4 border-2 border-black focus:outline-none focus:border-[#E60012] resize-none font-mono"
          placeholder="在此输入名字，每行一个..."
        />

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white font-bold text-lg transform skew-x-12 border-2 border-black hover:bg-gray-700"
          >
            <span className="block transform -skew-x-12">取消</span>
          </button>
          <button
            onClick={onSave}
            className="px-8 py-2 bg-[#E60012] text-white font-bold text-lg transform skew-x-12 border-2 border-black hover:bg-red-700 hover:scale-110 transition-transform"
          >
            <span className="block transform -skew-x-12">确认更改</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
