export const queries = {
  SELECTED_PLAYERS_WITH_RESOURCES: () => `
      SELECT player.id,
             name_player,
             json_agg(
                     json_build_object(
                             'count', count,
                             'name_resource', name_resource
                         )
                 ) resources
      FROM player
               LEFT OUTER JOIN resource_player
                               ON player.id = resource_player."playerId"
               LEFT OUTER JOIN resource
                               ON resource_player."resourceId" = resource.id
      GROUP BY player.id, name_player;
  `,
  SELECTED_GIFTS: () => `
      SELECT * FROM gift;
  `,
  SELECTED_PLAYERS: () => `
      SELECT * FROM player;
  `,
  UPDATE_RESOURCE: (player, resource, value) => `
      INSERT INTO resource_player (count, "playerId", "resourceId")
      values ('${value}', '${player}', '${resource}') ON CONFLICT ("playerId", "resourceId") DO
      UPDATE
          SET count = resource_player.count + '${value}'
      WHERE resource_player."playerId" = '${player}'
        and resource_player."resourceId" = '${resource}';
  `,
  SELECT_PLAYER_BY_PROPERTY: (nameProperty, valueProperty) => `
      select json_agg("playerId") keys
      from property_player
      where "propertyId" = (SELECT id from property WHERE name_property = '${nameProperty}' and value_property = '${valueProperty}');
  `,
  SELECT_COUNT_GIFT_BY_DATE: (currentDate) => `
      SELECT COUNT(*)
      FROM gift
      where data = '${currentDate}';
  `,
  ADD_GIFT: (resource, count, recipient) => `
      INSERT INTO gift ("resourceId", count, "recipientId")
      VALUES ('${resource}', '${count}', '${recipient}');
  `
};
