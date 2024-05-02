import { DocsEntityType, Supernova } from "@supernovaio/sdk";
import * as fs from 'fs';

const API_KEY = "***";
const WORKSPACE_ID = "123";
const DESIGN_SYSTEM_ID = "123";

const log = (data: object, file: string) => {
    const replacer = (key: string, value: string) =>
        (["gradientLayers", "shadowLayers"].includes(key)) ? key : value;

    fs.writeFileSync(file, JSON.stringify(data, replacer, 2));
    console.log(data);
}

(async function execute() {
    const sdk = new Supernova(API_KEY, { requestHook: () => {} });
    const me = await sdk.me.me();

    const workspaces = await sdk.workspaces.workspaces(me.id);
    const workspace = workspaces.find(w => w.id === WORKSPACE_ID)!;

    const designSystems = await sdk.designSystems.designSystems(workspace.id);
    const designSystem = designSystems.find(ds => ds.id === DESIGN_SYSTEM_ID)!;

    const draftVersion = (await sdk.versions.getActiveVersion(designSystem.id))!;

    const from = {
        workspaceId: workspace.id,
        designSystemId: designSystem.id,
        versionId: draftVersion.id,
    };

    // Tokens
    const tokens = await sdk.tokens.getTokens(from);
    log(tokens, "tokens.json");

    // Documentation
    const docStructure = await sdk.documentation.getDocumentationStructure(from);
    log(docStructure, "documentation.json");

    const welcomePage = docStructure.find(p => p.type === DocsEntityType.page && p.title === 'Welcome!')!;
    log(welcomePage, "page.json");
})();