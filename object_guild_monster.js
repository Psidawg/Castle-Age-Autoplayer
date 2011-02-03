
    ////////////////////////////////////////////////////////////////////
    //                          guild_monster OBJECT
    // this is the main object for dealing with guild monsters
    /////////////////////////////////////////////////////////////////////

    guild_monster = {
        records: [],

        record: function () {
            this.data = {
                'name'        : '',
                'guildId'     : '',
                'slot'        : 0,
                'ticker'      : '',
                'minions'     : [],
                'attacks'     : 1,
                'damage'      : 0,
                'myStatus'    : '',
                'reviewed'    : 0,
                'state'       : '',
                'enemyHealth' : 0,
                'guildHealth' : 0,
                'conditions'  : '',
                'color'       : $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961"))
            };
        },

        minion: function () {
            this.data = {
                'attacking_position' : 0,
                'target_id'          : 0,
                'name'               : '',
                'level'              : 0,
                'mclass'             : '',
                'healthNum'          : 0,
                'healthMax'          : 0,
                'status'             : '',
                'percent'            : 0
            };
        },

        me: function () {
            this.data = {
                'name'               : '',
                'level'              : 0,
                'mclass'             : '',
                'healthNum'          : 0,
                'healthMax'          : 0,
                'status'             : '',
                'percent'            : 0
            };
        },

        info: {
            "Vincent": {
                twt2     : "vincent",
                special1 : [0],
                special2 : [1],
                health   : [100, 200, 400, 800]
            },
            "Alpha Vincent": {
                twt2     : "alpha_vincent",
                special1 : [0],
                special2 : [1],
                health   : [500, 1000, 2000, 4000]
            },
            "Army of the Apocalypse": {
                twt2     : "ca_girls",
                special1 : [0, 25, 50, 75],
                special2 : [1, 2, 3, 4],
                health   : [500, 1000, 2000, 4000]
            },
            "Giant Arachnid": {
                twt2     : "giant_arachnid",
                special1 : [0],
                special2 : [1],
                health   : [100, 200, 400, 800]
            }
        },

        load: function () {
            try {
                guild_monster.records = gm.getItem('guild_monster.records', 'default');
                if (guild_monster.records === 'default' || !$j.isArray(guild_monster.records)) {
                    guild_monster.records = gm.setItem('guild_monster.records', []);
                }

                state.setItem("GuildMonsterDashUpdate", true);
                $u.log(3, "guild_monster.load", guild_monster.records);
                return true;
            } catch (err) {
                $u.error("ERROR in guild_monster.load: " + err);
                return false;
            }
        },

        save: function () {
            try {
                gm.setItem('guild_monster.records', guild_monster.records);
                state.setItem("GuildMonsterDashUpdate", true);
                $u.log(3, "guild_monster.save", guild_monster.records);
                return true;
            } catch (err) {
                $u.error("ERROR in guild_monster.save: " + err);
                return false;
            }
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        getItem: function (slot) {
            try {
                var it        = 0,
                    len       = 0,
                    success   = false,
                    newRecord = {};

                if (!$u.isNumber(slot)) {
                    $u.warn("slot", slot);
                    throw "Invalid identifying slot!";
                }

                if (slot === '') {
                    return '';
                }

                for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                    if (guild_monster.records[it]['slot'] === slot) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    $u.log(3, "Got guild_monster record", slot, guild_monster.records[it]);
                    return guild_monster.records[it];
                } else {
                    newRecord = new guild_monster.record();
                    newRecord.data['slot'] = slot;
                    $u.log(3, "New guild_monster record", slot, newRecord.data);
                    return newRecord.data;
                }
            } catch (err) {
                $u.error("ERROR in guild_monster.getItem: " + err);
                return false;
            }
        },

        setItem: function (record) {
            try {
                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                if (!$u.isNumber(record['slot']) || record['slot'] <= 0) {
                    $u.warn("slot", record['slot']);
                    throw "Invalid identifying slot!";
                }

                var it      = 0,
                    len     = 0,
                    success = false;

                for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                    if (guild_monster.records[it]['slot'] === record['slot']) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    guild_monster.records[it] = record;
                    $u.log(3, "Updated guild_monster record", record, guild_monster.records);
                } else {
                    guild_monster.records.push(record);
                    $u.log(3, "Added guild_monster record", record, guild_monster.records);
                }

                guild_monster.save();
                return true;
            } catch (err) {
                $u.error("ERROR in guild_monster.setItem: " + err);
                return false;
            }
        },

        deleteItem: function (slot) {
            try {
                var it        = 0,
                    len       = 0,
                    success   = false;

                if (!$u.isNumber(slot) || slot <= 0) {
                    $u.warn("slot", slot);
                    throw "Invalid identifying slot!";
                }

                for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                    if (guild_monster.records[it]['slot'] === slot) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    guild_monster.records.splice(it, 1);
                    guild_monster.save();
                    $u.log(3, "Deleted guild_monster record", slot, guild_monster.records);
                    return true;
                } else {
                    $u.warn("Unable to delete guild_monster record", slot, guild_monster.records);
                    return false;
                }
            } catch (err) {
                $u.error("ERROR in guild_monster.deleteItem: " + err);
                return false;
            }
        },
        /*jslint sub: false */

        clear: function () {
            try {
                $u.log(1, "guild_monster.clear");
                guild_monster.records = gm.setItem("guild_monster.records", []);
                state.setItem('staminaGuildMonster', 0);
                state.setItem('targetGuildMonster', {});
                state.setItem("GuildMonsterDashUpdate", true);
                return true;
            } catch (err) {
                $u.error("ERROR in guild_monster.clear: " + err);
                return false;
            }
        },

        navigate_to_main: function () {
            return caap.NavigateTo('guild', 'tab_guild_main_on.gif');
        },

        navigate_to_battles_refresh: function () {
            var button = caap.CheckForImage("guild_monster_tab_on.jpg");
            if ($u.hasContent(button)) {
                caap.Click(button);
            }

            state.setItem('guildMonsterBattlesRefresh', false);
            return $u.hasContent(button);
        },

        navigate_to_battles: function () {
            return caap.NavigateTo('guild,guild_current_monster_battles', 'guild_monster_tab_on.jpg');
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        populate: function () {
            try {
                var buttons = $j("input[src*='dragon_list_btn_']"),
                    slotArr = [],
                    it      = 0;

                if (buttons && buttons.length) {
                    buttons.each(function () {
                        var button        = $j(this),
                            form          = null,
                            currentRecord = {},
                            imageName     = '',
                            slot          = 0,
                            name          = '',
                            guildId       = '',
                            passed        = true;

                        form = button.parents("form").eq(0);
                        if (form && form.length) {
                            slot = form.find("input[name='slot']").eq(0).attr("value");
                            slot = slot ? slot.parseInt() : 0;
                            if ($u.isNumber(slot) && slot > 0 && slot <= 5) {
                                $u.log(3, "slot", slot);
                                slotArr.push(slot);
                                currentRecord = guild_monster.getItem(slot);
                                name = button.parents().eq(4).text();
                                name = name ? name.trim() : '';
                                if (name) {
                                    if (currentRecord['name'] !== name) {
                                        $u.log(1, "Updated name", currentRecord['name'], name);
                                        currentRecord['name'] = name;
                                    }
                                } else {
                                    $u.warn("name error", name);
                                    passed = false;
                                }

                                guildId = form.find("input[name='guild_id']").eq(0).attr("value");
                                if (caap.stats['guild']['id'] && guildId === caap.stats['guild']['id']) {
                                    if (currentRecord['guildId'] !== guildId) {
                                        $u.log(2, "Updated guildId", currentRecord['guildId'], guildId);
                                        currentRecord['guildId'] = guildId;
                                    }
                                } else {
                                    $u.warn("guildId error", guildId, caap.stats['guild']['id']);
                                    passed = false;
                                }

                                imageName = button.attr("src").basename();
                                if (imageName) {
                                    switch (imageName) {
                                    case "dragon_list_btn_3.jpg":
                                        currentRecord['color'] = $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961"));
                                        currentRecord['state'] = "Alive";
                                        break;
                                    case "dragon_list_btn_2.jpg":
                                    case "dragon_list_btn_4.jpg":
                                        currentRecord['color'] = "grey";
                                        if (currentRecord['state'] !== "Completed") {
                                            $u.log(2, "Updated state", currentRecord['state'], "Collect");
                                            currentRecord['state'] = "Collect";
                                        }

                                        break;
                                    default:
                                        currentRecord['state'] = "Error";
                                        $u.warn("state error", imageName);
                                        passed = false;
                                    }
                                } else {
                                    $u.warn("imageName error", button.attr("src"), imageName);
                                    passed = false;
                                }
                            } else {
                                $u.warn("slot error", slot);
                                passed = false;
                            }
                        } else {
                            $u.warn("form error", button);
                            passed = false;
                        }

                        if (passed) {
                            $u.log(2, "currentRecord/button", currentRecord, button);
                            guild_monster.setItem(currentRecord);
                        } else {
                            $u.warn("populate record failed", currentRecord, button);
                        }
                    });

                    for (it = guild_monster.records.length - 1; it >= 0; it -= 1) {
                        if (!slotArr.hasIndexOf(guild_monster.records[it]['slot'])) {
                            guild_monster.deleteItem(guild_monster.records[it]['slot']);
                        }
                    }

                    guild_monster.select(true);
                } else {
                    $u.log(1, "No buttons found");
                    guild_monster.clear();
                }

                caap.UpdateDashboard(true);
                return true;
            } catch (err) {
                $u.error("ERROR in guild_monster.populate: " + err);
                return false;
            }
        },

        onMonster: function () {
            try {
                var gates         = $j(),
                    health        = $j(),
                    healthGuild   = $j(),
                    healthEnemy   = $j(),
                    allowedDiv    = $j(),
                    bannerDiv     = $j(),
                    collectDiv    = $j(),
                    collect       = false,
                    myStatsTxt    = '',
                    myStatsArr    = [],
                    slot          = 0,
                    currentRecord = {},
                    minionRegEx   = new RegExp("(.*) Level (\\d+) Class: (.*) Health: (.+)/(.+) Status: (.*)");

                caap.chatLink(caap.appBodyDiv, "#" +  caap.domain.id[caap.domain.which] + "guild_war_chat_log div[style*='border-bottom: 1px'] div[style*='font-size: 15px']");
                slot = $j("input[name='slot']").eq(0).attr("value");
                slot = slot ? slot.parseInt() : 0;
                bannerDiv = $j("#" +  caap.domain.id[caap.domain.which] + "guild_battle_banner_section");
                myStatsTxt = bannerDiv.children().eq(2).children().eq(0).children().eq(1).text();
                myStatsTxt = myStatsTxt ? myStatsTxt.trim().innerTrim() : '';
                if ($u.isNumber(slot) && slot > 0 && slot <= 5) {
                    $u.log(3, "slot", slot);
                    currentRecord = guild_monster.getItem(slot);
                    currentRecord['minions'] = [];
                    currentRecord['ticker'] = '';
                    currentRecord['guildHealth'] = 0;
                    currentRecord['enemyHealth'] = 0;
                    if (!bannerDiv.attr("style").match(/_dead/)) {
                        currentRecord['ticker'] = $j("#" +  caap.domain.id[caap.domain.which] + "monsterTicker").text();
                        currentRecord['ticker'] = currentRecord['ticker'] ? currentRecord['ticker'].trim() : '';
                        if (myStatsTxt) {
                            $u.log(3, "myStatsTxt", myStatsTxt);
                            myStatsArr = myStatsTxt.match(new RegExp("(.+) Level: (\\d+) Class: (.+) Health: (\\d+)/(\\d+).+Status: (.+) Battle Damage: (\\d+)"));
                            if (myStatsArr && myStatsArr.length === 8) {
                                $u.log(2, "myStatsArr", myStatsArr);
                                currentRecord['damage'] = myStatsArr[7] ? myStatsArr[7].parseInt() : 0;
                                currentRecord['myStatus'] = myStatsArr[6] ? myStatsArr[6].trim() : '';
                            } else {
                                $u.warn("myStatsArr error", myStatsArr, myStatsTxt);
                            }
                        }

                        allowedDiv = $j("#" +  caap.domain.id[caap.domain.which] + "allowedAttacks");
                        if (allowedDiv && allowedDiv.length) {
                            currentRecord['attacks'] = allowedDiv.attr("value") ? allowedDiv.attr("value").parseInt() : 1;
                            if (currentRecord['attacks'] < 1 || currentRecord['attacks'] > 5) {
                                currentRecord['attacks'] = 1;
                                $u.warn("Invalid allowedAttacks");
                            }
                        } else {
                            $u.warn("Could not find allowedAttacks");
                        }

                        health = $j("#" +  caap.domain.id[caap.domain.which] + "guild_battle_health");
                        if (health && health.length) {
                            healthEnemy = health.find("div[style*='guild_battle_bar_enemy.gif']").eq(0);
                            if (healthEnemy && healthEnemy.length) {
                                currentRecord['enemyHealth'] = (100 - healthEnemy.getPercent('width')).dp(2);
                            } else {
                                $u.warn("guild_battle_bar_enemy.gif not found");
                            }

                            healthGuild = health.find("div[style*='guild_battle_bar_you.gif']").eq(0);
                            if (healthGuild && healthGuild.length) {
                                currentRecord['guildHealth'] = (100 - healthGuild.getPercent('width')).dp(2);
                            } else {
                                $u.warn("guild_battle_bar_you.gif not found");
                            }
                        } else {
                            $u.warn("guild_battle_health error");
                        }

                        gates = $j("div[id*='" +  caap.domain.id[caap.domain.which] + "enemy_guild_member_list_']");
                        if (!gates || !gates.length) {
                            $u.warn("No gates found");
                        } else if (gates && gates.length !== 4) {
                            $u.warn("Not enough gates found");
                        } else {
                            gates.each(function (gIndex) {
                                var memberDivs = $j(this).children();
                                if (!memberDivs || !memberDivs.length) {
                                    $u.warn("No members found");
                                } else if (memberDivs && memberDivs.length !== 25) {
                                    $u.warn("Not enough members found", memberDivs);
                                } else {
                                    memberDivs.each(function (mIndex) {
                                        var member       = $j(this),
                                            memberText   = '',
                                            memberArr    = [],
                                            targetIdDiv  = $j(),
                                            memberRecord = new guild_monster.minion().data;

                                        memberRecord['attacking_position'] = (gIndex + 1);
                                        targetIdDiv = member.find("input[name='target_id']").eq(0);
                                        if (targetIdDiv && targetIdDiv.length) {
                                            memberRecord['target_id'] = targetIdDiv.attr("value") ? targetIdDiv.attr("value").parseInt() : 1;
                                        } else {
                                            $u.warn("Unable to find target_id for minion!", member);
                                        }

                                        memberText = member.children().eq(1).text();
                                        memberText = memberText ? memberText.trim().innerTrim() : '';
                                        memberArr = memberText.match(minionRegEx);
                                        if (memberArr && memberArr.length === 7) {
                                            memberRecord['name'] = memberArr[1] ? memberArr[1] : '';
                                            memberRecord['level'] = memberArr[2] ? memberArr[2].parseInt() : 0;
                                            memberRecord['mclass'] = memberArr[3] ? memberArr[3] : '';
                                            memberRecord['healthNum'] = memberArr[4] ? memberArr[4].parseInt() : 0;
                                            memberRecord['healthMax'] = memberArr[5] ? memberArr[5].parseInt() : 1;
                                            memberRecord['status'] = memberArr[6] ? memberArr[6] : '';
                                            memberRecord['percent'] = ((memberRecord['healthNum'] / memberRecord['healthMax']) * 100).dp(2);
                                        }

                                        currentRecord['minions'].push(memberRecord);
                                    });
                                }
                            });
                        }
                    } else {
                        collectDiv = $j("input[src*='collect_reward_button2.jpg']");
                        if (collectDiv && collectDiv.length) {
                            $u.log(1, "Monster is dead and ready to collect");
                            currentRecord['state'] = 'Collect';
                            if (config.getItem('guildMonsterCollect', false)) {
                                collect = true;
                            }
                        } else {
                            $u.log(1, "Monster is completed");
                            currentRecord['state'] = 'Completed';
                        }

                        currentRecord['color'] = "grey";
                    }

                    currentRecord['reviewed'] = new Date().getTime();
                    $u.log(2, "currentRecord", currentRecord);
                    guild_monster.setItem(currentRecord);
                    if (collect) {
                        caap.Click(collectDiv);
                    }
                } else {
                    if (bannerDiv.children().eq(0).text().hasIndexOf("You do not have an on going guild monster battle. Have your Guild initiate more!")) {
                        slot = state.getItem('guildMonsterReviewSlot', 0);
                        if ($u.isNumber(slot) && slot > 0 && slot <= 5) {
                            $u.log(1, "monster expired", slot);
                            guild_monster.deleteItem(slot);
                        } else {
                            $u.warn("monster expired slot error", slot);
                        }
                    } else {
                        $u.log(1, "On another guild's monster", myStatsTxt);
                    }
                }

                return true;
            } catch (err) {
                $u.error("ERROR in guild_monster.onMonster: " + err);
                return false;
            }
        },

        getReview: function () {
            try {
                var it     = 0,
                    len    = 0;

                for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                    if (guild_monster.records[it]['state'] === 'Completed') {
                        continue;
                    }

                    if (!schedule.since(guild_monster.records[it]['reviewed'], 30 * 60)) {
                        continue;
                    }

                    break;
                }

                return guild_monster.records[it];
            } catch (err) {
                $u.error("ERROR in guild_monster.getReview: " + err);
                return undefined;
            }
        },

        checkPage: function (record) {
            try {
                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                var slot = 0;
                slot = $j("input[name='slot']").eq(0).attr("value");
                slot = slot ? slot.parseInt() : 0;
                return (record['slot'] === slot);
            } catch (err) {
                $u.error("ERROR in guild_monster.checkPage: " + err);
                return undefined;
            }
        },

        getTargetMinion: function (record) {
            try {
                var it              = 0,
                    ol              = 0,
                    len             = 0,
                    alive           = 0,
                    minion          = {},
                    minHealth       = 0,
                    specialTargets  = [],
                    firstSpecial    = -1,
                    ignoreClerics   = false,
                    attackOrderList = [],
                    isSpecial       = false,
                    isMatch         = false,
                    attackNorth     = config.getItem('attackGateNorth', true),
                    attackEast      = config.getItem('attackGateEast', true),
                    attackSouth     = config.getItem('attackGateSouth', true),
                    attackWest      = config.getItem('attackGateWest', true);

                if (!record || !$j.isPlainObject(record)) {
                    throw "Not passed a record";
                }

                minHealth = config.getItem('IgnoreMinionsBelow', 0);
                if (!$u.isNumber(minHealth)) {
                    minHealth = 0;
                }

                attackOrderList = config.getList('orderGuildMinion', '');
                if (!attackOrderList || attackOrderList.length === 0) {
                    attackOrderList = [String.fromCharCode(0)];
                    $u.log(2, "Added null character to getTargetMinion attackOrderList", attackOrderList);
                }

                ignoreClerics = config.getItem('ignoreClerics', false);
                for (ol = 0, len = attackOrderList.length; ol < len; ol += 1) {
                    if (minion && $j.isPlainObject(minion) && !$j.isEmptyObject(minion)) {
                        $u.log(2, "Minion matched and set - break", minion);
                        break;
                    }

                    specialTargets = guild_monster.info[record['name']].special1.slice();
                    for (it = record['minions'].length - 1; it >= 0; it -= 1) {
                        if (!attackNorth && record['minions'][it]['attacking_position'] === 1) {
                            $u.log(2, "Skipping North Minion", it, record['minions'][it]);
                            continue;
                        }

                        if (!attackWest && record['minions'][it]['attacking_position'] === 2) {
                            $u.log(2, "Skipping West Minion", it, record['minions'][it]);
                            continue;
                        }

                        if (!attackEast && record['minions'][it]['attacking_position'] === 3) {
                            $u.log(2, "Skipping East Minion", it, record['minions'][it]);
                            continue;
                        }

                        if (!attackSouth && record['minions'][it]['attacking_position'] === 4) {
                            $u.log(2, "Skipping South Minion", it, record['minions'][it]);
                            continue;
                        }

                        if (attackOrderList[ol] === String.fromCharCode(0)) {
                            isMatch = true;
                        } else {
                            isMatch = !record['minions'][it]['name'].toLowerCase().hasIndexOf(attackOrderList[ol].match(new RegExp("^[^:]+")).toString().trim().toLowerCase());
                        }

                        if (isMatch) {
                            $u.log(2, "Minion matched", it, record['minions'][it]);
                        }

                        isSpecial = specialTargets.hasIndexOf(it);
                        if (record['minions'][it]['status'] === 'Stunned') {
                            if (isSpecial && $u.isNaN(record['minions'][it]['healthNum'])) {
                                specialTargets.pop();
                                if (isMatch) {
                                    $u.log(2, "Special minion stunned", specialTargets);
                                }
                            } else if (isMatch) {
                                $u.log(2, "Minion stunned");
                            }

                            continue;
                        }

                        if (isSpecial) {
                            if (!$u.isNaN(record['minions'][it]['healthNum'])) {
                                specialTargets.pop();
                                $u.log(2, "Not special minion", it, specialTargets);
                                if (ignoreClerics && record['minions'][it]['mclass'] === "Cleric") {
                                    $u.log(2, "Ignoring Cleric", record['minions'][it]);
                                    continue;
                                }
                            } else if (firstSpecial < 0) {
                                firstSpecial = it;
                                $u.log(2, "firstSpecial minion", firstSpecial);
                            } else {
                                $u.log(2, "Special minion", it, specialTargets);
                            }
                        }

                        if (minHealth && !isSpecial) {
                            if (record['minions'][it]['healthNum'] < minHealth) {
                                if (!alive) {
                                    alive = it;
                                    $u.log(2, "First alive", alive);
                                }

                                continue;
                            }
                        }

                        if (!isMatch) {
                            continue;
                        }

                        minion = record['minions'][it];
                        break;
                    }
                }

                if ($j.isEmptyObject(minion) && firstSpecial >= 0) {
                    minion = record['minions'][firstSpecial];
                    $u.log(2, "Target Special", firstSpecial, record['minions'][firstSpecial]);
                }

                if (config.getItem('chooseIgnoredMinions', false) && alive) {
                    minion = record['minions'][alive];
                    $u.log(2, "Target Alive", alive, record['minions'][alive]);
                }

                $u.log(2, "Target minion", minion);
                return minion;
            } catch (err) {
                $u.error("ERROR in guild_monster.getTargetMinion: " + err);
                return undefined;
            }
        },

        select: function (force) {
            try {
                var it              = 0,
                    ol              = 0,
                    len             = 0,
                    len1            = 0,
                    attackOrderList = [],
                    conditions      = '',
                    ach             = 999999,
                    max             = 999999,
                    target          = {},
                    firstOverAch    = {},
                    firstUnderMax   = {};

                if (!(force || schedule.oneMinuteUpdate('selectGuildMonster'))) {
                    return false;
                }

                state.setItem('targetGuildMonster', {});
                attackOrderList = config.getList('orderGuildMonster', '');
                if (!attackOrderList || attackOrderList.length === 0) {
                    attackOrderList = [String.fromCharCode(0)];
                    $u.log(3, "Added null character to select attackOrderList", attackOrderList);
                }

                for (it = guild_monster.records.length - 1; it >= 0; it -= 1) {
                    if (guild_monster.records[it]['state'] !== 'Alive') {
                        guild_monster.records[it]['color'] = "grey";
                        guild_monster.records[it]['conditions'] = '';
                        continue;
                    }

                    attackOrderList.push(guild_monster.records[it]['slot'].toString());
                    guild_monster.records[it]['conditions'] = 'none';
                    guild_monster.records[it]['color'] = $u.bestTextColor(config.getItem("StyleBackgroundLight", "#E0C961"));
                }

                for (ol = 0, len1 = attackOrderList.length; ol < len1; ol += 1) {
                    conditions = attackOrderList[ol].replace(new RegExp("^[^:]+"), '').toString().trim();
                    for (it = 0, len = guild_monster.records.length; it < len; it += 1) {
                        if (guild_monster.records[it]['state'] !== 'Alive') {
                            guild_monster.records[it]['color'] = "grey";
                            continue;
                        }

                        if (guild_monster.records[it]['myStatus'] === 'Stunned') {
                            guild_monster.records[it]['color'] = "purple";
                            continue;
                        }

                        if (guild_monster.records[it]['conditions'] !== 'none') {
                            continue;
                        }

                        if (attackOrderList[ol] !== String.fromCharCode(0)) {
                            if (!(guild_monster.records[it]['slot'] + " " + guild_monster.records[it]['name'].toLowerCase()).hasIndexOf(attackOrderList[ol].match(new RegExp("^[^:]+")).toString().trim().toLowerCase())) {
                                continue;
                            }
                        }

                        if (conditions) {
                            guild_monster.records[it]['conditions'] = conditions;
                            if (conditions.hasIndexOf("ach")) {
                                ach = monster.parseCondition('ach', conditions);
                            }

                            if (conditions.hasIndexOf("max")) {
                                max = monster.parseCondition('max', conditions);
                            }
                        }

                        if (guild_monster.records[it]['damage'] >= ach) {
                            guild_monster.records[it]['color'] = "darkorange";
                            if (!firstOverAch || !$j.isPlainObject(firstOverAch) || $j.isEmptyObject(firstOverAch)) {
                                if (guild_monster.records[it]['damage'] >= max) {
                                    guild_monster.records[it]['color'] = "red";
                                    $u.log(2, 'OverMax', guild_monster.records[it]);
                                } else {
                                    firstOverAch = guild_monster.records[it];
                                    $u.log(2, 'firstOverAch', firstOverAch);
                                }
                            }
                        } else if (guild_monster.records[it]['damage'] < max) {
                            if (!firstUnderMax || !$j.isPlainObject(firstUnderMax) || $j.isEmptyObject(firstUnderMax)) {
                                firstUnderMax = guild_monster.records[it];
                                $u.log(2, 'firstUnderMax', firstUnderMax);
                            }
                        } else {
                            guild_monster.records[it]['color'] = "red";
                            $u.log(2, 'OverMax', guild_monster.records[it]);
                        }
                    }
                }

                target = firstUnderMax;
                if (!target || !$j.isPlainObject(target) || $j.isEmptyObject(target)) {
                    target = firstOverAch;
                }

                $u.log(2, 'target', target);
                if (target && $j.isPlainObject(target) && !$j.isEmptyObject(target)) {
                    target['color'] = 'green';
                    guild_monster.setItem(target);
                } else {
                    state.setItem('guildMonsterBattlesBurn', false);
                    guild_monster.save();
                }

                return state.setItem('targetGuildMonster', target);
            } catch (err) {
                $u.error("ERROR in guild_monster.select: " + err);
                return undefined;
            }
        },
        /*jslint sub: false */

        attack2stamina: {
            1: 1,
            2: 5,
            3: 10,
            4: 20,
            5: 50
        },

        /* This section is formatted to allow Advanced Optimisation by the Closure Compiler */
        /*jslint sub: true */
        getAttackValue: function (record, minion) {
            try {
                if (!minion || !$j.isPlainObject(minion)) {
                    throw "Not passed a minion";
                }

                var attack         = 0,
                    recordInfo     = guild_monster.info[record['name']],
                    specialTargets = recordInfo.special2.slice();

                if (specialTargets.hasIndexOf(minion['target_id']) && $u.isNaN(minion['healthNum'])) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else if (caap.stats['staminaT']['num'] < 10) {
                        attack = 2;
                    } else if (caap.stats['staminaT']['num'] < 20) {
                        attack = 3;
                    } else if (caap.stats['staminaT']['num'] < 50) {
                        attack = 4;
                    } else {
                        attack = 5;
                    }
                } else if (minion['healthNum'] < recordInfo.health[0]) {
                    attack = 1;
                } else if (minion['healthNum'] < recordInfo.health[1]) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else {
                        attack = 2;
                    }
                } else if (minion['healthNum'] < recordInfo.health[2]) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else if (caap.stats['staminaT']['num'] < 10) {
                        attack = 2;
                    } else {
                        attack = 3;
                    }
                } else if (minion['healthNum'] < recordInfo.health[3]) {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else if (caap.stats['staminaT']['num'] < 10) {
                        attack = 2;
                    } else if (caap.stats['staminaT']['num'] < 20) {
                        attack = 3;
                    } else {
                        attack = 4;
                    }
                } else {
                    if (caap.stats['staminaT']['num'] < 5) {
                        attack = 1;
                    } else if (caap.stats['staminaT']['num'] < 10) {
                        attack = 2;
                    } else if (caap.stats['staminaT']['num'] < 20) {
                        attack = 3;
                    } else if (caap.stats['staminaT']['num'] < 50) {
                        attack = 4;
                    } else {
                        attack = 5;
                    }
                }

                if (attack > record['attacks']) {
                    attack = record['attacks'];
                }

                $u.log(2, 'getAttackValue', attack);
                return attack;
            } catch (err) {
                $u.error("ERROR in guild_monster.getAttackValue: " + err);
                return undefined;
            }
        },

        getStaminaValue: function (record, minion) {
            try {
                if (!minion || !$j.isPlainObject(minion)) {
                    throw "Not passed a minion";
                }

                var stamina        = 0,
                    staminaCap     = 0,
                    recordInfo     = guild_monster.info[record['name']],
                    specialTargets = recordInfo.special2.slice();

                if (specialTargets.hasIndexOf(minion['target_id']) && $u.isNaN(minion['healthNum'])) {
                    stamina = 50;
                } else if (minion['healthNum'] < recordInfo.health[0]) {
                    stamina = 1;
                } else if (minion['healthNum'] < recordInfo.health[1]) {
                    stamina = 5;
                } else if (minion['healthNum'] < recordInfo.health[2]) {
                    stamina = 10;
                } else if (minion['healthNum'] < recordInfo.health[3]) {
                    stamina = 20;
                } else {
                    stamina = 50;
                }

                staminaCap = guild_monster.attack2stamina[record['attacks']];
                if (stamina > staminaCap) {
                    stamina = staminaCap;
                }

                $u.log(2, 'getStaminaValue', stamina);
                return stamina;
            } catch (err) {
                $u.error("ERROR in guild_monster.getStaminaValue: " + err);
                return undefined;
            }
        }
        /*jslint sub: false */
    };