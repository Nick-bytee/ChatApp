import Chat from "../Models/chat";
import ArchivedChats from "../Models/archivedChats";
import Group from "../Models/group";
import sequelize from "./database";

export const archiveChats = async () => {
  console.log("working");
  const t = await sequelize.transaction();
  try {
    const chats = await Chat.findAll({
      include: {
        model: Group,
      },
    });

    const archiveChats = chats.map(async (chat) => {
      await ArchivedChats.create(
        {
          message: chat.message,
          userId: chat.userId,
          groupId: chat.groupId,
          message_type: chat.messageType,
        },
        { transaction: t }
      );
    });
    await Chat.destroy({ truncate: true, transaction: t });
    await t.commit();
    console.log("Archived Chats Successfully");
  } catch (err) {
    await t.rollback();
    console.log("Failed to Archive Chats");
    console.error(err);
  }
};
