
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Names of testnets to be deleted
const testnetNamesToDelete = [
  "LayerZero",
  "Arbitrum Nova",
  "Scroll",
  "Celestia"
];

export const deleteOldTestnets = async (userId: string) => {
  const { toast } = useToast();
  
  try {
    const { error } = await supabase
      .from('airdrops')
      .delete()
      .eq('user_id', userId)
      .in('name', testnetNamesToDelete);
      
    if (error) {
      console.error("Error deleting old testnets:", error);
      toast({
        title: "Error",
        description: "Failed to delete old testnets",
        variant: "destructive",
      });
      return false;
    }
    
    toast({
      title: "Success",
      description: "Old testnets have been removed",
    });
    
    return true;
  } catch (error) {
    console.error("Error in deleteOldTestnets:", error);
    return false;
  }
};
