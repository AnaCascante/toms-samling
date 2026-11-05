import { defineType, defineField } from "sanity";

export const vinyl = defineType({
  name: "vinyl",
  title: "Vinyl",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tittel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "År",
      type: "string",
    }),
    defineField({
      name: "genre",
      title: "Sjanger",
      type: "string",
      options: {
        list: [
          "Rock",
          "Pop",
          "Jazz",
          "Klassisk",
          "Blues",
          "Country",
          "Electronic",
          "Hip-Hop",
          "R&B",
          "Soul",
          "Funk",
          "Reggae",
          "Metal",
          "Punk",
          "Folk",
          "Indie",
          "Alternativ",
          "Disco",
          "Annet",
        ],
      },
    }),
    defineField({
      name: "condition",
      title: "Tilstand",
      type: "string",
      options: {
        list: ["Mint", "Nær Mint", "Veldig God", "God", "Brukbar", "Dårlig"],
      },
    }),
    defineField({
      name: "label",
      title: "Plateselskap",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Pris (kr)",
      type: "string",
    }),
    defineField({
      name: "notes",
      title: "Notater",
      type: "text",
    }),
    defineField({
      name: "coverUrl",
      title: "Cover URL",
      type: "url",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Bilde",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
