import { LINKED_INSTANCE_URL } from "$lib/instance.js";
import { redirect } from "@sveltejs/kit";

export const load = () => {
  if (LINKED_INSTANCE_URL) {
    throw redirect(300, `/forgot_password/${LINKED_INSTANCE_URL}`)
  }
}