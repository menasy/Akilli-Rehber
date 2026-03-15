import * as Contacts from "expo-contacts";
import { Contact } from "../types";

export async function fetchContacts(): Promise<Contact[]> {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") return [];

    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.RawImage,
        Contacts.Fields.Image,
      ],
    });

    const mapped: Contact[] = data.map((c) => {
      const phoneNumber = c.phoneNumbers?.[0]?.number ?? "";

      return {
        id: c.id ?? Math.random().toString(),
        name: c.name ?? "No Name",
        phone: phoneNumber,
        avatar: c.rawImage?.uri || c.image?.uri || "",
      };
    });

    return mapped.filter((contact) => contact.phone.length > 0);

  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}