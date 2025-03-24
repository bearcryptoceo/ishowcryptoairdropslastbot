
import { supabase } from "@/integrations/supabase/client";

// Names of testnets to be deleted
const testnetNamesToDelete = [
  "LayerZero",
  "Arbitrum Nova",
  "Scroll",
  "Celestia"
];

export const deleteOldTestnets = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('airdrops')
      .delete()
      .eq('user_id', userId)
      .in('name', testnetNamesToDelete);
      
    if (error) {
      console.error("Error deleting old testnets:", error);
      return false;
    }
    
    console.log("Successfully deleted old testnets for user:", userId);
    return true;
  } catch (error) {
    console.error("Error in deleteOldTestnets:", error);
    return false;
  }
};
