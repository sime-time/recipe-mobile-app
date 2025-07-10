import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View, Text, FlatList, RefreshControl } from "react-native";
import { MealAPI } from "@/services/mealAPI";
import { homeStyles } from "@/assets/styles/home.styles";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import CategoryFilter from "@/components/category-filter";
import RecipeCard from "@/components/recipe-card";

export default function Index() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [featuredRecipe, setFeaturedRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // This function will be responsible for fetching the core data of the screen.
  const loadCoreData = async () => {
    setLoading(true);
    try {
      const [apiCategories, featuredMeal] = await Promise.all([
        MealAPI.getCategories(),
        MealAPI.getRandomMeal(),
      ]);

      const transformedCategories = apiCategories.map((cat: any, index: number) => ({
        id: index + 1,
        name: cat.strCategory,
        image: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
      }));

      setCategories(transformedCategories);
      setFeaturedRecipe(MealAPI.transformMealData(featuredMeal));

      // If no category is selected, default to the first one.
      // This will trigger the useEffect below to load the recipes.
      if (!selectedCategory && transformedCategories.length > 0) {
        setSelectedCategory(transformedCategories[0].name);
      }
    } catch (error) {
      console.log("Error loading core data", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // On refresh, we want to get a new featured meal and reload the current category recipes.
    try {
      await Promise.all([
        MealAPI.getRandomMeal().then(meal => setFeaturedRecipe(MealAPI.transformMealData(meal))),
        selectedCategory ? loadCategoryData(selectedCategory) : Promise.resolve(),
      ]);
    } catch (error) {
      console.log("Error refreshing data", error);
    }
    setRefreshing(false);
  };

  const loadCategoryData = async (category: string) => {
    // Set recipes to empty to show the empty state component while loading
    setRecipes([]);
    try {
      const meals = await MealAPI.filterByCategory(category);
      const transformedMeals = meals
        .map((meal: any) => MealAPI.transformMealData(meal))
        .filter((meal: any) => meal !== null);
      setRecipes(transformedMeals);
    } catch (error) {
      console.error("Error loading category data:", error);
      setRecipes([]); // Ensure recipes is empty on error
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  // Effect for the initial data load
  useEffect(() => {
    loadCoreData();
  }, []);

  // Effect to load recipes when the selected category changes
  useEffect(() => {
    if (selectedCategory) {
      loadCategoryData(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* ANIMAL ICONS */}
        <View style={homeStyles.animalSection}>
          <Image
            source={require("@/assets/images/lamb.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("@/assets/images/chicken.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("@/assets/images/pork.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        {/* FEATURED SECTION */}
        {featuredRecipe && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.9}
              onPress={() => router.push(`/recipe/${featuredRecipe.id}`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                />
                <View style={homeStyles.featuredOverlay}>
                  <View style={homeStyles.featuredBadge}>
                    <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                  </View>

                  <View style={homeStyles.featuredContent}>
                    <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                      {featuredRecipe.title}
                    </Text>

                    <View style={homeStyles.featuredMeta}>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.cookTime}</Text>
                      </View>
                      <View style={homeStyles.metaItem}>
                        <Ionicons name="people-outline" size={16} color={COLORS.white} />
                        <Text style={homeStyles.metaText}>{featuredRecipe.servings}</Text>
                      </View>
                      {featuredRecipe.area && (
                        <View style={homeStyles.metaItem}>
                          <Ionicons name="location-outline" size={16} color={COLORS.white} />
                          <Text style={homeStyles.metaText}>{featuredRecipe.area}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* CATEGORY FILTER */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {/* SELECTED CATEGORY RECIPE LIST */}
        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>
          <FlatList
            data={recipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={homeStyles.row}
            contentContainerStyle={homeStyles.recipesGrid}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={homeStyles.emptyState}>
                <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
                <Text style={homeStyles.emptyTitle}>No recipes found</Text>
                <Text style={homeStyles.emptyDescription}>Try a different category</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}
