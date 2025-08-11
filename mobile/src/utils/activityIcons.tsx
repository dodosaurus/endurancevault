import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export interface ActivityIconInfo {
  library: 'Ionicons' | 'MaterialIcons' | 'FontAwesome5';
  name: string;
}

export const getActivityIcon = (activityType: string): ActivityIconInfo => {
  const type = activityType.toLowerCase();
  
  // Running activities - FontAwesome5 has better running icons
  if (type === 'run' || type === 'trailrun' || type === 'virtualrun') {
    return { library: 'FontAwesome5', name: 'running' };
  }
  
  // Cycling activities - MaterialIcons has good bike icons
  if (type === 'ride' || type === 'mountainbikeride' || type === 'gravelride' || 
      type === 'virtualride' || type === 'ebikeride' || type === 'emountainbikeride') {
    return { library: 'MaterialIcons', name: 'directions-bike' };
  }
  
  // Walking activities - FontAwesome5 has walking icon
  if (type === 'walk') {
    return { library: 'FontAwesome5', name: 'walking' };
  }
  
  // Hiking activities - FontAwesome5 has hiking icon
  if (type === 'hike') {
    return { library: 'FontAwesome5', name: 'hiking' };
  }
  
  // Swimming activities - FontAwesome5 has swimmer
  if (type === 'swim') {
    return { library: 'FontAwesome5', name: 'swimmer' };
  }
  
  // Water sports
  if (type === 'kayaking' || type === 'canoeing' || type === 'rowing' || type === 'standuppaddling') {
    return { library: 'Ionicons', name: 'boat-outline' };
  }
  
  // Winter sports
  if (type === 'alpineski' || type === 'backcountryski' || type === 'nordicski' || 
      type === 'snowboard' || type === 'snowshoe') {
    return { library: 'FontAwesome5', name: 'skiing' };
  }
  
  // Strength training
  if (type === 'weighttraining' || type === 'crossfit') {
    return { library: 'FontAwesome5', name: 'dumbbell' };
  }
  
  // Yoga and flexibility
  if (type === 'yoga' || type === 'pilates') {
    return { library: 'MaterialIcons', name: 'self-improvement' };
  }
  
  // Ball sports
  if (type === 'tennis' || type === 'badminton' || type === 'tabletennis' || 
      type === 'pickleball' || type === 'squash' || type === 'racquetball') {
    return { library: 'FontAwesome5', name: 'table-tennis' };
  }
  
  if (type === 'soccer') {
    return { library: 'FontAwesome5', name: 'futbol' };
  }
  
  // Climbing
  if (type === 'rockclimbing') {
    return { library: 'FontAwesome5', name: 'mountain' };
  }
  
  // Default for other activities
  return { library: 'Ionicons', name: 'fitness-outline' };
};

export const renderActivityIcon = (activityType: string, size: number, color: string): React.JSX.Element => {
  const iconInfo = getActivityIcon(activityType);
  
  switch (iconInfo.library) {
    case 'FontAwesome5':
      return <FontAwesome5 name={iconInfo.name as any} size={size} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={iconInfo.name as any} size={size} color={color} />;
    case 'Ionicons':
    default:
      return <Ionicons name={iconInfo.name as any} size={size} color={color} />;
  }
};