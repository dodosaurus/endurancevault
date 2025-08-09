# Mobile App Structure

## Overview
React Native app built with Expo (managed workflow) featuring tab-based navigation and comprehensive state management.

## Project Structure
```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CollectionScreen.tsx
│   │   ├── ShopScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── navigation/         # Navigation configuration
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── contexts/           # React Context providers
│   │   └── AuthContext.tsx
│   ├── services/           # API and external services
│   │   └── api.ts
│   └── types/              # TypeScript type definitions
├── App.tsx                 # Root component
├── app.config.js           # Expo configuration
├── package.json
└── tsconfig.json
```

## Navigation Architecture

### Navigation Flow
```typescript
App.tsx
├── AuthProvider (Context wrapper)
└── NavigationContainer
    ├── AuthNavigator (if not authenticated)
    │   └── LoginScreen
    └── MainNavigator (if authenticated)
        ├── HomeScreen (Tab 1)
        ├── CollectionScreen (Tab 2)
        ├── ShopScreen (Tab 3)
        └── ProfileScreen (Tab 4)
```

### Auth Navigator
```typescript
// AuthNavigator.tsx
export type AuthStackParamList = {
  Login: undefined;
};

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
```

### Main Navigator
```typescript
// MainNavigator.tsx
export type MainTabParamList = {
  Home: undefined;
  Collection: undefined;
  Shop: undefined;
  Profile: undefined;
};

export function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Dynamic icon based on route
          const iconName = getIconName(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Collection" component={CollectionScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

## Screen Components

### LoginScreen
**Purpose**: Strava authentication entry point
**Features**:
- Gradient background design
- Feature highlights
- Strava OAuth integration
- Loading states

```typescript
export function LoginScreen() {
  const { signInWithStrava } = useAuth();
  
  return (
    <LinearGradient colors={['#FF6B35', '#F7931E']}>
      {/* Brand introduction */}
      {/* Feature highlights */}
      <TouchableOpacity onPress={signInWithStrava}>
        <Text>Connect with Strava</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}
```

### HomeScreen
**Purpose**: Dashboard and quick actions
**Features**:
- Welcome message with user name
- Currency display
- Activity sync button with loading state
- Quick access to booster opening
- Recent activity summary

```typescript
export function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSyncActivities = async () => {
    const result = await userApi.syncActivities();
    await refreshUser();
    // Show success alert
  };
  
  return (
    <ScrollView>
      {/* Header with greeting and currency */}
      {/* Quick action buttons */}
      {/* Activity summary */}
    </ScrollView>
  );
}
```

### CollectionScreen
**Purpose**: View and manage card collection
**Features**:
- Collection progress statistics
- Card grid layout
- Search and filtering (future)
- Collection score display

```typescript
export function CollectionScreen() {
  return (
    <SafeAreaView>
      {/* Collection stats header */}
      {/* Card grid or empty state */}
    </SafeAreaView>
  );
}
```

### ShopScreen
**Purpose**: Purchase booster packs
**Features**:
- Booster pack presentation
- Currency balance display
- Purchase button with affordability check
- Pack contents preview
- Insufficient funds handling

```typescript
export function ShopScreen() {
  const { user } = useAuth();
  const canAfford = (user?.currency || 0) >= BOOSTER_COST;
  
  return (
    <SafeAreaView>
      {/* Booster pack card */}
      {/* Purchase button */}
      {/* Insufficient funds warning */}
    </SafeAreaView>
  );
}
```

### ProfileScreen
**Purpose**: User profile and settings
**Features**:
- User information display
- Statistics summary
- Menu options (settings, transactions, etc.)
- Sign out functionality

```typescript
export function ProfileScreen() {
  const { user, signOut } = useAuth();
  
  return (
    <SafeAreaView>
      {/* User profile header */}
      {/* Statistics cards */}
      {/* Menu items */}
    </SafeAreaView>
  );
}
```

## Component Architecture

### Atomic Design Principles
```
Atoms (Basic UI elements)
├── Button
├── Input
├── Text
└── Icon

Molecules (Component combinations)
├── CurrencyDisplay
├── ActivityCard
├── CardItem
└── StatCard

Organisms (Complex components)
├── ActivityList
├── CollectionGrid
├── BoosterPackCard
└── UserProfile

Templates (Screen layouts)
├── AuthTemplate
├── TabTemplate
└── ModalTemplate

Pages (Actual screens)
├── LoginScreen
├── HomeScreen
├── CollectionScreen
├── ShopScreen
└── ProfileScreen
```

## State Management

### Context Providers
```typescript
// App-level context wrapping
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
```

### Auth Context Usage
```typescript
// Any component can access auth state
const { user, isLoading, signInWithStrava, signOut, refreshUser } = useAuth();

// Automatic authentication flow
useEffect(() => {
  const initAuth = async () => {
    await initializeAuth();
    const userData = await userApi.getProfile();
    setUser(userData);
  };
  initAuth();
}, []);
```

## Styling and Theming

### Design System
```typescript
const theme = {
  colors: {
    primary: '#FF6B35',      // Orange brand color
    secondary: '#F7931E',    // Secondary orange
    success: '#10B981',      // Green for success states
    warning: '#F59E0B',      // Amber for warnings
    error: '#EF4444',        // Red for errors
    text: '#1F2937',         // Dark gray for text
    textSecondary: '#6B7280', // Light gray for secondary text
    background: '#F8F9FA',   // Light background
    surface: '#FFFFFF',      // White surface
    border: '#E5E7EB'        // Border color
  },
  typography: {
    h1: { fontSize: 28, fontWeight: 'bold' },
    h2: { fontSize: 24, fontWeight: 'bold' },
    h3: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16 },
    caption: { fontSize: 12, color: '#6B7280' }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }
};
```

### Component Styling
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  }
});
```

## Performance Optimizations

### Image Optimization
- Lazy loading for card images
- Image caching with Expo Image
- Placeholder images during loading

### List Performance
- FlatList for large collections
- getItemLayout for consistent item sizes
- keyExtractor optimization

### Memory Management
- Cleanup listeners on component unmount
- Image cache management
- API request cancellation

## Future Enhancements

### Navigation Improvements
- Stack navigation within tabs
- Modal presentations for card details
- Deep linking for specific screens

### Component Library
- Standardized component library
- Storybook integration for component documentation
- Automated visual regression testing

### State Management Evolution
- Migration to Redux Toolkit (if needed)
- Offline state management
- Real-time data synchronization