<script lang="ts">
  import { Archive, CopySimple, TreeStructure } from "phosphor-svelte";
  import { ProjectStore } from "../../../entities/stores/projects-store";
  import CardButton from "../../components/buttons/card-button.svelte";
  import { ProjectsController } from "../../../entities/controllers/projects-controller";
  import { NotificationAction, NotificationData, notificationManager }
    from "../../components/notifications/notification-center";
  import { SystemConfigurationController } from "../../../entities/controllers/system-configuration-controller";
  import { navigation } from "../../lib/navigation";

  export let project : ProjectStore;

  // eslint-disable-next-line max-lines-per-function
  const editLatestVersion = async () : Promise<void> => {
    const entity = project.toEntity();
    const hasVersions = entity.versions.length > 0;

    if (!hasVersions) {
      const notification = new NotificationData("error", "Project has no versions.",
        "It's not possible to edit the latest version because the project is empty.", false, 8500);
      const createFirstVersion = new NotificationAction(async () => {
        await ProjectsController.selectProject(entity);
        await SystemConfigurationController.createNewEmptyConfiguration();
        notificationManager.dismissVisible(notification);
      }, "Create New Version");

      notification.buttonActions.push(createFirstVersion);
      notificationManager.notify(notification);
      return;
    }

    await ProjectsController.editLatestVersion(entity);
    navigation.navigateTo(entity.getVersionNavigationPath(entity.getLatestVersionIdentifier()));
  };
</script>

<div class="h-9 mt-4 mb-1 px-0.5 pb-0.5 w-full flex flex-row justify-between items-center">
  <div class="flex h-full w-fit">
    <CardButton hoverColor={"green"} class="w-9 h-9"
      clickFunction={editLatestVersion}>
      <TreeStructure class="w-7 h-7"/>
    </CardButton>
    <CardButton hoverColor={"yellow"} class="ml-4 w-9 h-9">
      <CopySimple class="w-7 h-7"/>
    </CardButton>
  </div>
  <CardButton hoverColor={"red"} class="w-9 h-9">
    <Archive class="w-7 h-7"/>
  </CardButton>
</div>
