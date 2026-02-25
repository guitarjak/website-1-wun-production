import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
function isTipTapDoc(value) {
  return typeof value === "object" && value !== null && "type" in value && value.type === "doc";
}
function lessonContentToHtml(content) {
  if (!content) return "";
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (isTipTapDoc(parsed)) {
        return generateHTML(parsed, [StarterKit, Link]);
      }
    } catch {
      return content;
    }
    return content;
  }
  if (isTipTapDoc(content)) {
    try {
      return generateHTML(content, [StarterKit, Link]);
    } catch {
      return "";
    }
  }
  return "";
}
export {
  lessonContentToHtml as l
};
