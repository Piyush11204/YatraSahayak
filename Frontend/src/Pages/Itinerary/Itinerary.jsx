// Itinerary.jsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MapPin, Calendar, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import useItineraryStore from './ItineraryService';

const ItineraryItem = ({ item, index, onRemove, isExpanded, onToggleExpand }) => {
  return (
    <Draggable draggableId={item._id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden"
        >
          <div className="flex items-center p-4">
            <div {...provided.dragHandleProps} className="mr-3 text-gray-400 hover:text-gray-600">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{item.placeName}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggleExpand(item._id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => onRemove(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="mr-4">{item.location}</span>
                <Calendar className="w-4 h-4 mr-1" />
                <span>{item.bestSeasonToVisit}</span>
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="px-4 pb-4 pt-2 border-t border-gray-100">
              <p className="text-gray-700 text-sm">{item.text}</p>
              {/* <p className="text-gray-700 text-sm">{item.location}</p> */}
              {/* {item.img && item.img[0] && (
                <img
                  src={item.img[0]}
                  alt={item.placeName}
                  className="mt-3 rounded-md w-full h-48 object-cover"
                />
              )} */}
              <div className="mt-3 text-xs text-gray-500">
                Added on: {new Date(item.addedAt).toLocaleDateString()}
              </div>
            </div>
          )}
        </li>
      )}
    </Draggable>
  );
};

const Itinerary = ({ userId }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());
  const { getUserItinerary, removeFromItinerary, reorderItinerary, clearItinerary } = useItineraryStore();

  const itinerary = getUserItinerary(userId);

  const handleRemoveItem = (itemId) => {
    removeFromItinerary(userId, itemId);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    reorderItinerary(userId, result.source.index, result.destination.index);
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-lg p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Itinerary</h2>
        {itinerary.length > 0 && (
          <button
            onClick={() => clearItinerary(userId)}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {itinerary.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Your itinerary is empty. Add some amazing places!</p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="itinerary-list">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {itinerary.map((item, index) => (
                  <ItineraryItem
                    key={item._id}
                    item={item}
                    index={index}
                    onRemove={handleRemoveItem}
                    isExpanded={expandedItems.has(item._id)}
                    onToggleExpand={toggleItemExpansion}
                  />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default Itinerary;
