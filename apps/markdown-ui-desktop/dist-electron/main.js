import { app as f, BrowserWindow as y, ipcMain as c, dialog as S } from "electron";
import * as t from "node:fs/promises";
import * as d from "node:path";
let l = null;
function w() {
  return f.getPath("userData");
}
function h() {
  return d.join(w(), "config.json");
}
function s() {
  return d.join(w(), "projects", "index.json");
}
function p(e) {
  return d.join(w(), "projects", `${e}.md`);
}
async function g() {
  await t.mkdir(d.join(w(), "projects"), { recursive: !0 });
}
function P() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function N(e) {
  return e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
const F = `# Untitled Project

Start writing your markdown here...
`;
function _() {
  c.handle("getDefaultLocation", () => w()), c.handle("pickLocation", async () => {
    if (!l) return null;
    const e = await S.showOpenDialog(l, {
      properties: ["openDirectory", "createDirectory"]
    });
    return e.canceled || e.filePaths.length === 0 ? null : e.filePaths[0];
  }), c.handle("readConfig", async () => {
    try {
      const e = await t.readFile(h(), "utf-8");
      return JSON.parse(e);
    } catch {
      return null;
    }
  }), c.handle("writeConfig", async (e, n) => {
    await t.writeFile(h(), JSON.stringify(n, null, 2), "utf-8");
  }), c.handle("listProjects", async () => {
    try {
      const e = await t.readFile(s(), "utf-8");
      return [...JSON.parse(e).projects].sort(
        (i, a) => new Date(a.updatedAt).getTime() - new Date(i.updatedAt).getTime()
      );
    } catch {
      return [];
    }
  }), c.handle("readProject", async (e, n) => {
    try {
      const i = await t.readFile(s(), "utf-8"), r = JSON.parse(i).projects.find((o) => o.id === n);
      return r ? await t.readFile(p(r.fileName), "utf-8") : "";
    } catch {
      return "";
    }
  }), c.handle("writeProject", async (e, n, i) => {
    await g();
    const a = await t.readFile(s(), "utf-8").catch(() => '{"projects":[]}'), r = JSON.parse(a), o = r.projects.find((u) => u.id === n);
    o && (o.updatedAt = (/* @__PURE__ */ new Date()).toISOString(), await t.writeFile(s(), JSON.stringify(r, null, 2), "utf-8"), await t.writeFile(p(o.fileName), i, "utf-8"));
  }), c.handle("createProject", async (e, n) => {
    await g();
    const i = P(), a = N(n) || `project-${i}`, r = (/* @__PURE__ */ new Date()).toISOString(), o = { id: i, name: n, fileName: a, createdAt: r, updatedAt: r };
    let u = { projects: [] };
    try {
      const m = await t.readFile(s(), "utf-8");
      u = JSON.parse(m);
    } catch {
    }
    return u.projects.push(o), await t.writeFile(s(), JSON.stringify(u, null, 2), "utf-8"), await t.writeFile(p(a), F, "utf-8"), { id: i, name: n, createdAt: r, updatedAt: r };
  }), c.handle("deleteProject", async (e, n) => {
    try {
      const i = await t.readFile(s(), "utf-8"), a = JSON.parse(i), r = a.projects.find((o) => o.id === n);
      if (!r) return;
      a.projects = a.projects.filter((o) => o.id !== n), await t.writeFile(s(), JSON.stringify(a, null, 2), "utf-8"), await t.rm(p(r.fileName)).catch(() => {
      });
    } catch {
    }
  });
}
function j() {
  l = new y({
    width: 1200,
    height: 800,
    title: "Markdown UI",
    webPreferences: {
      preload: d.join(__dirname, "preload.js"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), process.env.VITE_DEV_SERVER_URL ? l.loadURL(process.env.VITE_DEV_SERVER_URL) : l.loadFile(d.join(__dirname, "../dist/index.html")), l.on("closed", () => {
    l = null;
  });
}
f.whenReady().then(() => {
  _(), j(), f.on("activate", () => {
    y.getAllWindows().length === 0 && j();
  });
});
f.on("window-all-closed", () => {
  process.platform !== "darwin" && f.quit();
});
