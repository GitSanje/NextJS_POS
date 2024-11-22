"use server"
import { cache } from "@/lib/cache";
import { categoryType, SelectType } from "@/types";
import { prisma } from "@/vendor/prisma";

// Function overloads
export function getCategories(fromClient: true): Promise<SelectType[]>;
export function getCategories(fromClient: false): Promise<categoryType>;
export function getCategories(fromClient: boolean): Promise<SelectType[] | categoryType>;

// Implementation of getCategories
export async function getCategories(fromClient: boolean): Promise<SelectType[] | categoryType> {


    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                categoryName: true,
                description: true,
            },
        });

        if (fromClient) {
            
            const selectTypeCategories: SelectType[] = categories.map((category) => ({
                id: category.id,
                label: category.categoryName,
                value: category.categoryName.toUpperCase(),
            }));
            return selectTypeCategories;
        }

        // Return raw categories
        return categories as categoryType;
    } catch (error) {
        console.error(error);
        throw error; // Better to throw than return null to maintain type safety
    }
}


// export async function cachedGetCategories(fromClient: boolean): Promise<SelectType | categoryType | null> {
  
//     return cache(async () => await getCategories(fromClient), ["getCategories"], { revalidate: 60 * 60 });
// }