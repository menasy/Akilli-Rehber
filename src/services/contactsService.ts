import * as Contacts from "expo-contacts";
import { Contact } from "../types";
import { phoneticNormalize } from "../ai/phoneticNormalizer";

export async function fetchContacts(): Promise<Contact[]> {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") return [];

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Image,
      ],
    });

    console.log("Rehberden 1 gelen ham veri adedi:", data.length);

    const mapped: Contact[] = data.map((c) => {
      const phoneNumber = c.phoneNumbers && c.phoneNumbers.length > 0 
        ? c.phoneNumbers[0].number 
        : "";

      const name = c.name ?? "No Name";
      const normalizedName = name.toLowerCase().trim();
      const phoneticName = phoneticNormalize(name);

      return {
        id: c.id ?? Math.random().toString(),
        name,
        phone: phoneNumber ?? "",
        avatar: c.image?.uri ?? "",
        isFavorite: false,
        normalizedName,
        phoneticName,
      };
    });

    // Sadece telefon numarası olanları döndür
    return mapped.filter((contact) => contact.phone.length > 0);

  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}