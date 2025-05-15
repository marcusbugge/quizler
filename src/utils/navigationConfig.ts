// Liste over stier som IKKE skal vise navbar
export const pagesWithoutNavbar: string[] = [
  // Legg til stier her, f.eks:
  "/login",
  "/register",

  // Du kan legge til flere stier etter behov
];

// Funksjon for å sjekke om en side skal ha navbar
export const shouldShowNavbar = (path: string): boolean => {
  return !pagesWithoutNavbar.some(
    (route) =>
      // Eksakt match
      path === route ||
      // Eller sjekk om stien starter med en rute som ikke skal ha navbar
      (route.endsWith("*") && path.startsWith(route.slice(0, -1)))
  );
};
