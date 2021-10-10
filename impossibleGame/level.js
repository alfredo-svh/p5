/*
	File: definitions.js

	Provides all the objects in the level of an Impossible Game clone

*/


const GOAL = 1113 * TILELENGTH;
player = new Player();



// debug
// player = new Player();

blocks = [new Block(60), new Block(64, 1), new Block(124), new Block(128, 1), new Block(132, 2), new Block(137.5, 1), new Block(143), new Block(179), new Block(189), new Block(213),
		  new Block(217, 1), new Block(218, 1), new Block(249), new Block(253.3, 1), new Block(257.6, 2), new Block(261.9, 3), new Block(262.9, 3), new Block(263.9, 3), new Block(264.9, 3),
		  new Block(265.9, 3), new Block(266.9, 3), new Block(267.9, 3), new Block(268.9, 3), new Block(269.9, 3), new Block(270.9, 3), new Block(271.9, 3), new Block(276.2, 4),
		  new Block(281.8, 3), new Block(287.4, 2), new Block(290.4, 1), new Block(291.7, 3), new Block(293.4), new Block(299.1), new Block(303.4, 1), new Block(307.7, 2), new Block(312, 3),
		  new Block(316.3, 4), new Block(320.6, 5), new Block(324.9, 6), new Block(329.2, 7), new Block(333.5, 8), new Block(337.8, 9), new Block(342.1, 10), new Block(346.4, 11),
		  new Block(350.7, 12), new Block(355, 13), new Block(359.3, 14), new Block(363.6, 15), new Block(367.9, 16), new Block(372.2, 17), new Block(376.5, 18), new Block(380.8, 19),
		  new Block(385.1, 20), new Block(390.8, 19), new Block(391.8, 19), new Block(392.8, 19), new Block(394.8, 18), new Block(400.5, 17), new Block(407.4, 16), new Block(408.4, 16),
		  new Block(412.1, 15), new Block(417.8, 14), new Block(418.8, 14), new Block(419.8, 14), new Block(420.8, 14), new Block(421.8, 14), new Block(422.8, 14), new Block(423.8, 14),
		  new Block(424.8, 14), new Block(425.8, 14), new Block(426.8, 14), new Block(427.8, 14), new Block(428.8, 14), new Block(429.8, 14), new Block(430.8, 14), new Block(431.8, 14),
		  new Block(434.8, 13), new Block(440.5, 12), new Block(446.2, 11), new Block(451.9, 10), new Block(457.6, 9), new Block(463.3, 8), new Block(469, 7), new Block(474.7, 6),
		  new Block(480.4, 5), new Block(486.1, 4), new Block(491.8, 3), new Block(497.5, 2), new Block(503.2, 1), new Block(508.9), new Block(530), new Block(534.3, 1),
		  new Block(538.6, 2), new Block(542.9, 3), new Block(547.2, 4), new Block(551.5, 5), new Block(558, 1), new Block(612), new Block(622), new Block(626.3, 1), new Block(630.6, 2),
		  new Block(634.9, 3), new Block(639.2, 4), new Block(643.5, 5), new Block(650, 1), new Block(704), new Block(720), new Block(724.3, 1), new Block(728.6, 2), new Block(732.9, 3),
		  new Block(737.2, 4), new Block(741.5, 5), new Block(745.8, 6), new Block(750.1, 7), new Block(754.4, 8), new Block(758.7, 9), new Block(763, 10), new Block(766, 9),
		  new Block(771.3, 9), new Block(775.6, 10), new Block(779.9, 11), new Block(784.2, 12), new Block(788.5, 13), new Block(794.5, 10), new Block(798.8, 11), new Block(803.1, 12),
		  new Block(807.4, 13), new Block(811.7, 14), new Block(816, 15), new Block(820.3, 16), new Block(824.6, 17), new Block(828.9, 18), new Block(831.9, 17), new Block(836.2, 18),
		  new Block(839.2, 17), new Block(843.5, 18), new Block(847.8, 19), new Block(852.1, 20), new Block(857.8, 19), new Block(862.1, 20), new Block(866.4, 21), new Block(870.7, 22),
		  new Block(880, 2), new Block(881, 2), new Block(945), new Block(949.3, 1), new Block(952.3), new Block(996), new Block(1000.3, 1), new Block(1004.6, 2), new Block(1007.6, 1),
		  new Block(1011.9, 2), new Block(1014.9, 1), new Block(1019.2, 2), new Block(1024.9, 1), new Block(1029.2, 2), new Block(1032.2, 1), new Block(1036.5, 2), new Block(1042.2, 1),
		  new Block(1046.5, 2), new Block(1052.2, 1), new Block(1056.5, 2), new Block(1059.5, 1), new Block(1065.2), new Block(1108), new Block(1112.3, 1), new Block(1116.6, 2),
		  new Block(1120.9, 3), new Block(1125.2, 4), new Block(1129.5, 5), new Block(1133.8, 6), new Block(1138.1, 7), new Block(1142.4, 8), new Block(1146.7, 9), new Block(1151, 10),
		  new Block(1155.3, 11), new Block(1159.6, 12), new Block(1163.9, 13), new Block(1168.2, 14), new Block(1172.5, 15), new Block(1176.8, 16), new Block(1181.1, 17), new Block(1185.4, 18),
		  new Block(1189.7, 19), new Block(1194, 20), new Block(1198.3, 21), new Block(1202.6, 22), new Block(1206.9, 23)
];

spikes = [new Spike(27), new Spike(36), new Spike(42), new Spike(43), new Spike(73), new Spike(74), new Spike(88), new Spike(104), new Spike(110), new Spike(115), new Spike(116),
		  new Spike(150), new Spike(169), new Spike(180), new Spike(181), new Spike(182), new Spike(188), new Spike(191), new Spike(197), new Spike(218, 2), new Spike(222),
		  new Spike(223), new Spike(229), new Spike(241), new Spike(291.7, 4), new Spike(391.8, 20), new Spike(392.8, 20), new Spike(408.4, 17), new Spike(421.8, 15), new Spike(426.8, 15),
		  new Spike(431.8, 15), new Spike(515), new Spike(522), new Spike(523), new Spike(524), new Spike(567), new Spike(573), new Spike(579), new Spike(584),
		  new Spike(590), new Spike(591), new Spike(596), new Spike(597), new Spike(604), new Spike(605), new Spike(606), new Spike(613), new Spike(614),
		  new Spike(615), new Spike(616),new Spike(659), new Spike(665), new Spike(671), new Spike(676), new Spike(682), new Spike(683), new Spike(688), new Spike(689), new Spike(696),
		  new Spike(697), new Spike(698), new Spike(705), new Spike(706), new Spike(707), new Spike(708), new Spike(893), new Spike(894), new Spike(900), new Spike(901), new Spike(905),
		  new Spike(906), new Spike(913), new Spike(914), new Spike(919), new Spike(920), new Spike(925), new Spike(926), new Spike(927), new Spike(930), new Spike(931), new Spike(932),
		  new Spike(937), new Spike(943), new Spike(944), new Spike(953.3), new Spike(954.3), new Spike(955.3), new Spike(956.3), new Spike(957.3), new Spike(964), new Spike(970), new Spike(978),
		  new Spike(983), new Spike(988), new Spike(1072), new Spike(1078), new Spike(1079), new Spike(1085), new Spike(1086), new Spike(1087), new Spike(1093), new Spike(1094), new Spike(1100)
];

pools = [new Lava(61, 65), new Lava(125, 143), new Lava(250, 508), new Lava(530, 563), new Lava(622, 656), new Lava(721, 886), new Lava(946, 952), new Lava(997, 1065), new Lava(1109, 1200)];