// GET /api/admin/me: who is signed in, and which parts of the site are set up (yes/no only, never the values).

import { adminRoute } from '../../../lib/admin.js';
import { emailList, json } from '../../../lib/http.js';
import { ALL_AREAS, FORMS, PRIORITIES, STATUSES } from '../../../lib/forms.js';

export const onRequestGet = adminRoute(async function ({ env }, admin) {
  return json({
    email: admin.email,
    setup: {
      database: Boolean(env.DB),
      files: Boolean(env.FILES),
      turnstile: Boolean(env.TURNSTILE_SECRET && env.TURNSTILE_SITE_KEY),
      email: Boolean(env.RESEND_API_KEY),
      ownerEmail: emailList(env.OWNER_EMAIL).length > 0
    },
    forms: Object.keys(FORMS).map(function (id) {
      return { id: id, name: FORMS[id].name, short: FORMS[id].short, fields: FORMS[id].fields.map(function (f) { return { id: f.id, label: f.label, type: f.type }; }) };
    }),
    areas: ALL_AREAS,
    statuses: STATUSES.map(function (s) { return { id: s.id, label: s.label }; }),
    priorities: PRIORITIES
  });
});
